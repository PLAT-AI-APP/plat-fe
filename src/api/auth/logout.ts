import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const PostLogout = async () => {
  const response = await authAxios.post<ApiSuccessResponse>("/auth/logout");

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 로그아웃 */
export const useLogoutMutation = () => {
  const router = useRouter();
  const logout = useAuthStore().logout;
  return useMutation<{ serverMessage: string }, AppError>({
    mutationFn: PostLogout,
    onSuccess: () => {
      logout();
      router.push("/");
    },
  });
};
