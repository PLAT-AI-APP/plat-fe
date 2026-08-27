import { create } from "zustand";

export type AppToastType = "success" | "info" | "warning" | "error";
export type ToastExitReason = "timeout" | "manual" | "overflow";

export interface ToastData {
  id: string;
  type: AppToastType;
  message: string;
  description?: string;
}

interface ToastState {
  toasts: ToastData[];
  /** exit 애니메이션 duration을 결정하기 위한, id별 퇴장 사유. AnimatePresence가
   *  toast를 배열에서 뺀 뒤에도 잠깐 마운트 상태를 유지하는 동안 ToastItem이 직접
   *  구독해서 읽습니다. */
  exitReasons: Record<string, ToastExitReason>;
  /** id별 실측 높이(px). 설명 유무·s/m 사이즈로 실제 높이가 제각각이라, 맨 위(1번째)와
   *  2번째 toast가 절대 겹치지 않도록 1번째의 실측 높이를 기준으로 2번째 위치를 잡습니다. */
  heights: Record<string, number>;
  addToast: (toast: ToastData) => void;
  removeToast: (id: string, reason: ToastExitReason) => void;
  /** toast가 실제로 언마운트된 뒤 exitReasons/heights에 남은 기록을 정리합니다. */
  cleanupToast: (id: string) => void;
  setHeight: (id: string, height: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  exitReasons: {},
  heights: {},

  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),

  removeToast: (id, reason) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
      exitReasons: { ...state.exitReasons, [id]: reason },
    })),

  cleanupToast: (id) =>
    set((state) => {
      if (!(id in state.exitReasons) && !(id in state.heights)) return state;
      const exitReasons = { ...state.exitReasons };
      const heights = { ...state.heights };
      delete exitReasons[id];
      delete heights[id];
      return { exitReasons, heights };
    }),

  setHeight: (id, height) =>
    set((state) =>
      state.heights[id] === height
        ? state
        : { heights: { ...state.heights, [id]: height } },
    ),
}));
