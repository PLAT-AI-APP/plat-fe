import { toast } from "sonner";
import type React from "react";
import { Info } from "@/icons";
import type { AppLocale } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";
import StatusError from "@/icons/StatusError";
import StatusSuccessLine from "@/icons/StatusSuccessLine";
import StatusWarning from "@/icons/StatusWarning";

export type AppToastType = "success" | "info" | "warning" | "error";
export type AppToastSize = "m" | "s";

interface ShowAppToastOptions {
  description?: string;
  size?: AppToastSize;
}

/** s 사이즈 alert 확인 버튼 문구 */
const TOAST_CONFIRM_LABEL_BY_LOCALE: Record<AppLocale, string> = {
  ko: "확인",
  en: "OK",
  ja: "確認",
  zh: "确认",
  th: "ยืนยัน",
  vi: "Xác nhận",
};

/** 현재 언어에 맞는 toast 확인 문구 */
const getToastConfirmLabel = () => {
  const locale = useLocaleStore.getState().locale;

  return TOAST_CONFIRM_LABEL_BY_LOCALE[locale];
};

/** s 사이즈 alert 상태 아이콘 */
const SMALL_TOAST_ICON_BY_TYPE = {
  success: <StatusSuccessLine className="app-toast-s__status-icon" />,
  info: <Info className="app-toast-s__status-icon" />,
  warning: <StatusWarning className="app-toast-s__status-icon" />,
  error: <StatusError className="app-toast-s__status-icon" />,
} satisfies Record<AppToastType, React.ReactNode>;

/** 모든 toast 노출 시간 (globals.css의 --app-toast-duration과 값을 맞춰야 합니다.) */
const APP_TOAST_DURATION = 5_000;

/** 동시에 쌓아둘 toast 최대 개수 (Toaster의 visibleToasts와 값을 맞춰야 합니다.) */
const MAX_VISIBLE_TOASTS = 3;

/** 초과분 toast가 투명해지는 데 걸리는 시간 (globals.css의 전환 시간과 값을 맞춰야 합니다.) */
const APP_TOAST_OVERFLOW_FADE_OUT_DURATION = 480;

/** 노출 중인 toast id를 오래된 순으로 추적합니다. */
const activeToastIds: (string | number)[] = [];

/** 이미 사라진 toast id를 추적 목록에서 제거합니다. */
const unregisterAppToast = (toastId: string | number) => {
  const index = activeToastIds.indexOf(toastId);
  if (index !== -1) {
    activeToastIds.splice(index, 1);
  }
};

/** 최대 개수를 넘기면 가장 오래된 toast부터 제거합니다. */
const registerAppToast = (toastId: string | number) => {
  activeToastIds.push(toastId);

  if (activeToastIds.length <= MAX_VISIBLE_TOASTS) return;

  const oldestToastId = activeToastIds.shift();
  if (oldestToastId === undefined) return;

  // 새 toast가 올라오는 순간 초과분은 Toaster의 visibleToasts 때문에 이미 서서히 투명해지고 있습니다.
  // 여기서 바로 dismiss하면 그 전환을 끊고 sonner의 짧은 제거 모션이 끼어들어 튀므로,
  // 완전히 투명해진 뒤에 제거합니다.
  setTimeout(
    () => toast.dismiss(oldestToastId),
    APP_TOAST_OVERFLOW_FADE_OUT_DURATION,
  );
};

const showSmallAppToast = (
  type: AppToastType,
  message: string,
  description?: string,
) => {
  const newToastId = toast.custom(
    (toastId) => (
      <div className={`app-toast-s app-toast-s-${type}`}>
        <div className="app-toast-s__content">
          <span className="app-toast-s__icon">
            {SMALL_TOAST_ICON_BY_TYPE[type]}
          </span>

          <div className="app-toast-s__text">
            <p className="app-toast-s__title">{message}</p>
            {description && (
              <p className="app-toast-s__description">{description}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          className="app-toast-s__action"
          onClick={() => toast.dismiss(toastId)}
        >
          {getToastConfirmLabel()}
        </button>
      </div>
    ),
    {
      className: "sonner-custom-s",
      duration: APP_TOAST_DURATION,
      onDismiss: () => unregisterAppToast(newToastId),
      onAutoClose: () => unregisterAppToast(newToastId),
    },
  );

  registerAppToast(newToastId);
};

/** 앱 전역 toast 디자인 옵션 */
export const showAppToast = (
  type: AppToastType,
  message: string,
  options: ShowAppToastOptions = {},
) => {
  const { description, size = "m" } = options;

  if (size === "s") {
    showSmallAppToast(type, message, description);
    return;
  }

  const newToastId = toast[type](message, {
    description,
    duration: APP_TOAST_DURATION,
    onDismiss: () => unregisterAppToast(newToastId),
    onAutoClose: () => unregisterAppToast(newToastId),
  });

  registerAppToast(newToastId);
};
