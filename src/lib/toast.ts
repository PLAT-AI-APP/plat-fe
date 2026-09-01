export type { AppToastType } from "@/store/useToastStore";
import { useToastStore, type AppToastType } from "@/store/useToastStore";

interface ShowAppToastOptions {
  description?: string;
}

/**
 * 모든 toast 노출 시간.
 * ToastItem이 이 값을 CSS가 아닌 framer-motion transition으로 그대로 사용하므로,
 * 여기 하나만 바꾸면 자동 닫힘 타이머와 등장 후 노출 시간이 항상 같이 맞춰집니다.
 */
export const APP_TOAST_DURATION = 3_000;

/** 동시에 쌓아둘 toast 최대 개수. */
export const MAX_VISIBLE_TOASTS = 3;

/**
 * 자연 만료 시 재생되는 퇴장 fade 길이. 총 노출 시간(APP_TOAST_DURATION)에 이 시간이
 * 포함되도록, 실제 배열 제거는 (APP_TOAST_DURATION - APP_TOAST_FADE_OUT_DURATION)
 * 시점에 일어나고, 그 뒤 AnimatePresence가 이 길이만큼 퇴장 애니메이션을 재생합니다.
 */
export const APP_TOAST_FADE_OUT_DURATION = 900;

/** 초과분(MAX_VISIBLE_TOASTS를 넘겨 밀려난 toast) 제거 시 재생되는 fade 길이. */
export const APP_TOAST_OVERFLOW_FADE_OUT_DURATION = 480;

const autoDismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

const clearAutoDismiss = (id: string) => {
  const timer = autoDismissTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    autoDismissTimers.delete(id);
  }
};

const scheduleAutoDismiss = (id: string) => {
  autoDismissTimers.set(
    id,
    setTimeout(() => {
      autoDismissTimers.delete(id);
      useToastStore.getState().removeToast(id, "timeout");
    }, APP_TOAST_DURATION - APP_TOAST_FADE_OUT_DURATION),
  );
};

/** 닫기(X)/확인 버튼 클릭 시 ToastItem이 호출합니다. */
export const dismissAppToast = (id: string) => {
  clearAutoDismiss(id);
  useToastStore.getState().removeToast(id, "manual");
};

/** 앱 전역 toast 디자인 옵션 */
export const showAppToast = (
  type: AppToastType,
  message: string,
  options: ShowAppToastOptions = {},
) => {
  const { description } = options;
  const { toasts, addToast, removeToast } = useToastStore.getState();

  const id = crypto.randomUUID();
  addToast({ id, type, message, description });
  scheduleAutoDismiss(id);

  if (toasts.length >= MAX_VISIBLE_TOASTS) {
    const oldest = toasts[0];
    clearAutoDismiss(oldest.id);
    // 추가와 제거가 같은 렌더에서 동시에 일어나면 AnimatePresence가 계속 남아있는
    // toast들의 순위(rank) prop 갱신을 놓치는 문제가 있어(둘 다 rank가 바뀌는 상황이
    // 겹치기 때문으로 보임), 한 틱 늦춰 별도 커밋으로 분리합니다.
    setTimeout(() => removeToast(oldest.id, "overflow"), 0);
  }
};
