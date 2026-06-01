"use client";

import { Toaster } from "sonner";

const SonnerProvider = () => {
  return (
    <Toaster
      position="top-right"
      expand
      closeButton
      duration={3200}
      offset={16}
      theme="dark"
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
