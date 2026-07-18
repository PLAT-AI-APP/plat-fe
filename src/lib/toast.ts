import { toast } from "sonner";

export type AppToastType = "success" | "info" | "warning" | "error";
export type AppToastSize = "m" | "s";

interface ShowAppToastOptions {
  description?: string;
  size?: AppToastSize;
}

/** 앱 전역 toast 디자인 옵션 */
export const showAppToast = (
  type: AppToastType,
  message: string,
  options: ShowAppToastOptions = {},
) => {
  const { description, size = "m" } = options;

  toast[type](message, {
    description,
    className: size === "s" ? "sonner-size-s" : undefined,
  });
};
