import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

/** 보호 화면에서 로그아웃했다면 홈으로 이동. 이동했으면 true 반환 */
const redirectHomeIfProtected = () => {
  if (typeof window === "undefined") return false;

  if (!isProtectedPath(window.location.pathname)) return false;

  sessionStorage.removeItem(PENDING_SIGNUP_COMPLETE_DIALOG_KEY);
  sessionStorage.removeItem(PENDING_WELCOME_CREDIT_DIALOG_KEY);
  sessionStorage.setItem(SKIP_AUTH_ALERT_ONCE_KEY, "true");
  sessionStorage.setItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY, "true");
  window.location.replace("/");
  return true;
};

/** 로그아웃 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearBalance = useWalletStore((state) => state.clearBalance);
  return useMutation<void, AppError>({
    mutationFn: PostLogout,
    onSuccess: () => {
      logout();
      clearUser();
      clearBalance();
      // 로그인 상태에 종속된 캐시가 남아있지 않도록 전체 비우기
      queryClient.clear();

      // 보호 화면은 홈으로 이동하고, 그 외 화면은 전체 새로고침 대신
      // 서버 데이터만 다시 가져와 UI 애니메이션이 처음부터 다시 재생되지 않게 합니다.
      const movedHome = redirectHomeIfProtected();
      if (!movedHome) {
        router.refresh();
      }
    },
  });
};
