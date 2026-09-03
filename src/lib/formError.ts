import type { FieldErrors, FieldValues, Path } from "react-hook-form";
import { showAppToast } from "@/lib/toast";

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
 * 바로 넘길 수 있는 공통 핸들러. 첫 번째 필드 에러를 toast로 안내하고
 * (setFocus를 넘기면) 해당 input으로 포커스를 옮긴다.
 *
 * zod 스키마의 에러 메시지는 FIELD_ERROR_MESSAGES처럼 실제 문구가 아니라
 * "field.error.xxx" 형태의 i18n 키인 경우가 많아, useTranslateText()로 얻은
 * translate 함수를 넘겨야 실제 문구가 표시된다(안 넘기면 키가 그대로 노출됨).
 */
export const showFirstFieldErrorToast = <T extends FieldValues>(
  errors: FieldErrors<T>,
  setFocus?: (name: Path<T>) => void,
  translate?: (message: string) => string | undefined,
) => {
  const firstError = findFirstFieldError<T>(errors);
  if (!firstError) return;

  const message = translate?.(firstError.message) ?? firstError.message;
  showAppToast("warning", message);
  setFocus?.(firstError.path);
};
