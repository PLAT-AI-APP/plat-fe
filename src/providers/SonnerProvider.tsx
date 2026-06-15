"use client";

import { Info } from "@/icons";
import StatusError from "@/icons/StatusError";
import StatusSuccess from "@/icons/StatusSuccess";
import { Toaster } from "sonner";

const SonnerProvider = () => {
  return (
    <Toaster
      position="top-center"
      closeButton
      duration={2000}
      offset={40}
      theme="dark"
      icons={{
        success: <StatusSuccess className="sonner-status-icon" />,
        error: <StatusError className="sonner-status-icon" />,
        info: <Info className="sonner-status-icon" />,
        // 요청한 피그마 노드(1311:2148)의 시각 기준에 맞춰 warning도 동일 아이콘을 사용합니다.
        warning: <StatusError className="sonner-status-icon" />,
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
