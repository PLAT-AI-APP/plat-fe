"use client";

import type { CSSProperties } from "react";
import { CloseLine, Info } from "@/icons";
import StatusError from "@/icons/StatusError";
import StatusSuccess from "@/icons/StatusSuccess";
import StatusWarning from "@/icons/StatusWarning";
import {
  APP_TOAST_DURATION,
  APP_TOAST_OVERFLOW_FADE_OUT_DURATION,
  MAX_VISIBLE_TOASTS,
} from "@/lib/toast";
import { Toaster } from "sonner";

const SonnerProvider = () => {
  return (
    <Toaster
      position="top-center"
      closeButton
      duration={APP_TOAST_DURATION}
      gap={16}
      offset={40}
      visibleToasts={MAX_VISIBLE_TOASTS}
      theme="dark"
      // CSS(globals.css)의 sonner 퇴장 애니메이션이 이 값들을 그대로 읽어 쓰므로,
      // JS 타이머와 CSS 애니메이션 길이가 서로 어긋나 애니메이션이 끊기는 일이 없습니다.
      style={
        {
          "--app-toast-duration": `${APP_TOAST_DURATION}ms`,
          "--app-toast-overflow-fade-duration": `${APP_TOAST_OVERFLOW_FADE_OUT_DURATION}ms`,
        } as CSSProperties
      }
      icons={{
        success: <StatusSuccess className="sonner-status-icon" />,
        error: <StatusError className="sonner-status-icon" />,
        info: <Info className="sonner-status-icon" />,
        close: (
          <CloseLine
            className="sonner-close-icon text-font-disabled"
            size={20}
          />
        ),
        // Warning toast status icon
        warning: <StatusWarning className="sonner-status-icon" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "sonner-toast",
          title: "sonner-title",
          description: "sonner-description",
          actionButton: "sonner-action",
          cancelButton: "sonner-cancel",
          closeButton: "sonner-close",
          success: "sonner-success",
          error: "sonner-error",
          warning: "sonner-warning",
          info: "sonner-info",
        },
      }}
    />
  );
};

export default SonnerProvider;
