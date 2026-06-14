import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";

interface PostEmailLoginProps {
  username: string;
  password: string;
}

const PostEmailLogin = async (props: PostEmailLoginProps) => {
  const response = await axiosInstance.post<
    ApiSuccessResponse<{ accessToken: string; isFirstLogin?: boolean }>
  >("/auth/login", props, {
    withCredentials: true,
  });

  return {
    isFirstLogin: Boolean(response.data.data.isFirstLogin),
    serverMessage: response.data.message ?? "",
    token: response.data.data.accessToken,
  };
};

/** 이메일 로그인 */
export const useEmailLoginMutation = () => {
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  return useMutation<
    { isFirstLogin: boolean; serverMessage: string; token: string },
    AppError,
    PostEmailLoginProps
  >({
    mutationFn: PostEmailLogin,
    onSuccess: async (data) => {
      setAccessToken(data.token);
      setLoggedIn(true);
      await queryClient.invalidateQueries({ queryKey: ["get-my-info"] });
    },
  });
};
