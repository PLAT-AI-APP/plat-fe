import type { FieldErrors, FieldValues, Path } from "react-hook-form";

interface FieldErrorLeaf {
  type?: string;
  message?: string;
}

const isFieldErrorLeaf = (value: unknown): value is FieldErrorLeaf => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return "message" in value || "type" in value;
};

/**
 * react-hook-form의 errors 트리(배열/중첩 객체 포함)를 선언 순서대로 훑어
 * 가장 먼저 걸리는 필드 에러를 찾는다. 필드 렌더 순서와 스키마 선언 순서가
 * 대체로 같아, 화면에 보이는 첫 번째 에러와 대체로 일치한다.
 */
export const findFirstFieldError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  prefix = "",
): { path: Path<T>; message: string } | null => {
  for (const key of Object.keys(errors)) {
    const value = (errors as Record<string, unknown>)[key];
    if (!value) continue;

    const path = prefix ? `${prefix}.${key}` : key;

    if (isFieldErrorLeaf(value) && typeof value.message === "string") {
      return { path: path as Path<T>, message: value.message };
    }

    if (typeof value === "object") {
      const nested = findFirstFieldError<T>(value as FieldErrors<T>, path);
      if (nested) return nested;
    }
  }

  return null;
};

/**
 * handleSubmit(onValid, onInvalid)의 onInvalid, 혹은 RHF <Form onError>에
 * 바로 넘길 수 있는 공통 핸들러. 첫 번째 필드 에러로 포커스를 옮긴다.
 *
 * 예전에는 여기서 toast 도 함께 띄웠다. 그런데 그 문구는 이미 SmartInput 이
 * 해당 입력칸 바로 아래에 그리고 있어서 같은 말을 두 번 하는 셈이었고,
 * warning 색이라 "입력을 빠뜨렸다" 가 아니라 "시스템에 문제가 생겼다" 로
 * 읽혔다. 입력 실수는 그 입력칸이 말하는 것이 맞다.
 *
 * 포커스 이동은 남긴다. 화면 밖에 있는 필드가 문제일 때 사용자를 그리로
 * 데려가는 일은 필드 자신이 할 수 없다.
 *
 * zod 스키마의 에러 메시지는 실제 문구가 아니라 "field.error.xxx" 형태의
 * i18n 키인 경우가 많다. 반환값을 쓰려면 useTranslateText()로 얻은 translate
 * 함수를 넘겨야 한다(안 넘기면 키가 그대로 나온다).
 */
export const focusFirstFieldError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  setFocus?: (name: Path<T>) => void,
  translate?: (message: string) => string | undefined,
): { path: Path<T>; message: string } | null => {
  const firstError = findFirstFieldError<T>(errors);
  if (!firstError) return null;

  setFocus?.(firstError.path);

  return {
    path: firstError.path,
    message: translate?.(firstError.message) ?? firstError.message,
  };
};
