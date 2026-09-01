"use client";

import type React from "react";
import { Info } from "@/icons";
import StatusError from "@/icons/StatusError";
import StatusSuccessLine from "@/icons/StatusSuccessLine";
import StatusWarning from "@/icons/StatusWarning";
import type { AppLocale } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";
import type { AppToastType, ToastData } from "@/store/useToastStore";

/** s 사이즈 alert 확인 버튼 문구 */
const TOAST_CONFIRM_LABEL_BY_LOCALE: Record<AppLocale, string> = {
  ko: "확인",
  en: "OK",
  ja: "確認",
  zh: "确认",
  th: "ยืนยัน",
  vi: "Xác nhận",
};

/** s 사이즈 alert 상태 아이콘 */
const SMALL_TOAST_ICON_BY_TYPE: Record<AppToastType, React.ReactNode> = {
  success: <StatusSuccessLine className="app-toast-s__status-icon" />,
  info: <Info className="app-toast-s__status-icon" />,
  warning: <StatusWarning className="app-toast-s__status-icon" />,
  error: <StatusError className="app-toast-s__status-icon" />,
};

interface ToastContentSProps {
  toast: ToastData;
  onConfirm: () => void;
}

const ToastContentS = ({ toast, onConfirm }: ToastContentSProps) => {
  const locale = useLocaleStore((state) => state.locale);

  return (
    <>
      <div className="app-toast-s__content">
        <span className="app-toast-s__icon">
          {SMALL_TOAST_ICON_BY_TYPE[toast.type]}
        </span>
        <div className="app-toast-s__text">
          <p className="app-toast-s__title">{toast.message}</p>
          {toast.description && (
            <p className="app-toast-s__description">{toast.description}</p>
          )}
        </div>
      </div>

      <button type="button" className="app-toast-s__action" onClick={onConfirm}>
        {TOAST_CONFIRM_LABEL_BY_LOCALE[locale]}
      </button>
    </>
  );
};

export default ToastContentS;
