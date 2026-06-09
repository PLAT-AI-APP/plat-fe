"use client";

import { Info } from "@/icons";
import StatusError from "@/icons/StatusError";
import StatusSuccess from "@/icons/StatusSuccess";
import StatusWarning from "@/icons/StatusWarning";
import { Toaster } from "sonner";

const SonnerProvider = () => {
  return (
    <Toaster
      position="top-center"
      expand
      duration={2000}
      offset={40}
      theme="dark"
      icons={{
        success: <StatusSuccess className="sonner-status-icon" />,
        error: <StatusError className="sonner-status-icon" />,
        info: <Info className="sonner-status-icon" />,
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
