import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

interface PostEmailLoginProps {
  username: string;
  password: string;
}

const PostEmailLogin = async (props: PostEmailLoginProps) => {
  const response = await axiosInstance.post<
    ApiSuccessResponse<{ accessToken: string }>
  >("/auth/login", props, {
    withCredentials: true,
  });

  return {
    serverMessage: response.data.message ?? "",
    token: response.data.data.accessToken,
  };
};

/** 이메일 로그인 */
export const useEmailLoginMutation = () => {
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const { closeModal } = useModalStore();
  return useMutation<
    { serverMessage: string; token: string },
    AppError,
    PostEmailLoginProps
  >({
    mutationFn: PostEmailLogin,
    onSuccess: async (data) => {
      setAccessToken(data.token);
      setLoggedIn(true);
      await queryClient.invalidateQueries({ queryKey: ["get-my-info"] });
      closeModal();
    },
  });
};
