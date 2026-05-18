import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { logout } = useAuthStore();
  const { clearUser } = useUserStore();
  return useMutation<{ serverMessage: string }, AppError>({
    mutationFn: PostLogout,
    onSuccess: () => {
      logout();
      clearUser();
      router.push("/");
    },
  });
};
