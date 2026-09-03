import type { AppError } from "@/api";

/**
 * 에러 코드 상수의 소유처.
 *
 * api/index.ts 가 이 모듈을 가져다 쓰므로(반대 방향은 타입 import 뿐이라 런타임에 지워진다)
 * 값은 반드시 여기에 둔다. 반대로 두면 두 모듈이 서로를 런타임에 필요로 하는 순환이 된다.
 */
/** 응답 자체가 오지 않은 실패를 서버 에러와 구분하기 위한 코드입니다. */
export const NETWORK_ERROR_CODE = "NETWORK_ERROR";
export const TIMEOUT_ERROR_CODE = "TIMEOUT";
/** 서버가 code를 주지 않았을 때의 자리표시자입니다. */
export const UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR";

const FALLBACK_MESSAGE = "요청을 처리하지 못했습니다.";

/** 알 수 없는 값도 AppError 모양인지 판별합니다. react-query error는 unknown으로 흘러옵니다. */
export const isAppError = (error: unknown): error is AppError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error;

/** 사용자에게 보여줄 문구. 서버가 i18n 해석까지 마친 message를 이미 주므로 그것을 우선합니다. */
export const resolveErrorMessage = (error: unknown): string => {
  if (!isAppError(error)) return FALLBACK_MESSAGE;

  return error.message?.trim() || FALLBACK_MESSAGE;
};

/** 재시도해서 풀릴 만한 실패인지. 네트워크·타임아웃·5xx는 다시 눌러볼 값이 있습니다. */
export const isRetryableError = (error: unknown): boolean => {
  if (!isAppError(error)) return true;

  if (
    error.code === NETWORK_ERROR_CODE ||
    error.code === TIMEOUT_ERROR_CODE
  ) {
    return true;
  }

  return (error.status ?? 0) >= 500;
};

/**
 * 개발자용 한 줄 요약. `GET /home/today-pick · 500 · INTERNAL_ERROR` 형태.
 *
 * 사용자 문구만으로는 어느 화면의 어떤 호출이 깨졌는지 알 수 없어서, 개발 모드에서는
 * 이 줄을 토스트와 콘솔에 함께 남긴다. 프로덕션에서는 내부 경로를 노출하지 않는다.
 */
export const formatErrorDetail = (error: unknown): string | undefined => {
  if (process.env.NODE_ENV === "production") return undefined;
  if (!isAppError(error)) return undefined;

  const parts = [
    [error.requestMethod, error.requestUrl].filter(Boolean).join(" "),
    error.status !== undefined ? String(error.status) : undefined,
    error.code && error.code !== UNKNOWN_ERROR_CODE ? error.code : undefined,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : undefined;
};
