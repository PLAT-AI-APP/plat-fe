import { toast } from "sonner";
import type React from "react";
import { Info } from "@/icons";
import type { AppLocale } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";
import StatusError from "@/icons/StatusError";
import StatusSuccess from "@/icons/StatusSuccess";
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
  success: <StatusSuccess className="app-toast-s__status-icon" />,
  info: <Info className="app-toast-s__status-icon" />,
  warning: <StatusWarning className="app-toast-s__status-icon" />,
  error: <StatusError className="app-toast-s__status-icon" />,
} satisfies Record<AppToastType, React.ReactNode>;

const showSmallAppToast = (
  type: AppToastType,
  message: string,
  description?: string,
) => {
  toast.custom(
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
      duration: 30_000,
    },
  );
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

  toast[type](message, {
    description,
  });
};
