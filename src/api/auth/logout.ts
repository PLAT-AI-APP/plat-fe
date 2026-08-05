import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";
import {
  LOGOUT_REDIRECT_IN_PROGRESS_KEY,
  PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
  PENDING_WELCOME_CREDIT_DIALOG_KEY,
  SKIP_AUTH_ALERT_ONCE_KEY,
  isProtectedPath,
} from "@/constants/auth";

const PostLogout = async () => {
  await authAxios.post("/auth/logout");
};

/** 로그아웃 후 이동 처리 */
const redirectAfterLogout = () => {
  if (typeof window === "undefined") return;

  const shouldMoveHome = isProtectedPath(window.location.pathname);

  sessionStorage.removeItem(PENDING_SIGNUP_COMPLETE_DIALOG_KEY);
  sessionStorage.removeItem(PENDING_WELCOME_CREDIT_DIALOG_KEY);

  if (shouldMoveHome) {
    sessionStorage.setItem(SKIP_AUTH_ALERT_ONCE_KEY, "true");
    sessionStorage.setItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY, "true");
    window.location.replace("/");
    return;
  }

  window.location.reload();
};

/** 로그아웃 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { clearUser } = useUserStore();
  const { clearBalance } = useWalletStore();
  return useMutation<void, AppError>({
    mutationFn: PostLogout,
    onSuccess: () => {
      logout();
      clearUser();
      clearBalance();
      queryClient.removeQueries({ queryKey: ["get-my-info"] });
      queryClient.removeQueries({ queryKey: ["get-wallet-balance"] });
      // 보호 화면에서는 홈으로 이동하고, 그 외 화면에서는 기존처럼 새로고침
      redirectAfterLogout();
    },
  });
};
