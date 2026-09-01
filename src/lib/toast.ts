import { toast } from "sonner";

export type AppToastType = "success" | "info" | "warning" | "error";

interface ShowAppToastOptions {
  description?: string;
}

/** 모든 toast 노출 시간 */
export const APP_TOAST_DURATION = 3_000;

/**
 * 앱 전역 toast.
 *
 * 성공/실패 피드백은 반드시 이 함수로만 노출해 문구와 노출 시간을 통일한다.
 * sonner 의 toast 는 모듈 수준 싱글턴이라 React 컴포넌트 밖에서도 호출할 수
 * 있다(axios 인터셉터인 src/api/index.ts 가 그렇게 쓴다).
 */
export const showAppToast = (
  type: AppToastType,
  message: string,
  options: ShowAppToastOptions = {},
) => {
  const { description } = options;

  toast[type](message, {
    description,
    duration: APP_TOAST_DURATION,
  });
};

/** API 에러 응답을 toast로 노출한다. */
export const showErrorToast = (
  error: unknown,
  fallback = "요청에 실패했습니다.",
) => {
  const message =
    error instanceof Error && error.message ? error.message : fallback;

  showAppToast("error", message);
};
