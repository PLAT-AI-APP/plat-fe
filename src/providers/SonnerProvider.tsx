"use client";

import { CloseLine, Info } from "@/icons";
import StatusError from "@/icons/StatusError";
import StatusSuccess from "@/icons/StatusSuccess";
import StatusWarning from "@/icons/StatusWarning";
import { Toaster } from "sonner";

const SonnerProvider = () => {
  return (
    <Toaster
      position="top-center"
      closeButton
      duration={2000}
      expand
      gap={12}
      offset={40}
      visibleToasts={3}
      theme="dark"
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
