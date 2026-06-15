import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

const PostLogout = async () => {
  const response = await authAxios.post<ApiSuccessResponse>("/auth/logout");

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 로그아웃 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { clearUser } = useUserStore();
  return useMutation<{ serverMessage: string }, AppError>({
    mutationFn: PostLogout,
    onSuccess: () => {
      logout();
      clearUser();
      queryClient.removeQueries({ queryKey: ["get-my-info"] });
      // 로그아웃 후에는 홈으로 이동하지 않고 현재 경로를 기준으로 브라우저를 새로고침합니다.
      window.location.reload();
    },
  });
};
