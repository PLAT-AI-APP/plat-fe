import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

const PostLogout = async () => {
  await authAxios.post<ApiSuccessResponse>("/auth/logout");
};

/** 로그아웃 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { clearUser } = useUserStore();
  return useMutation<void, AppError>({
    mutationFn: PostLogout,
    onSuccess: () => {
      logout();
      clearUser();
      queryClient.removeQueries({ queryKey: ["get-my-info"] });
      // 로그아웃 후 현재 경로를 기준으로 브라우저를 새로고침
      window.location.reload();
    },
  });
};
