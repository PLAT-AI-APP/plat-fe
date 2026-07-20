import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { AppToastSize, AppToastType } from "@/lib/toast";

export type LoginToastSize = AppToastSize;
export type LoginToastType = AppToastType;

interface PostEmailLoginProps {
  username: string;
  password: string;
}

const PostEmailLogin = async (props: PostEmailLoginProps) => {
  const response = await axiosInstance.post<
    ApiSuccessResponse<{
      accessToken: string;
      isFirstLogin?: boolean;
      toastDescription?: string;
      toastSize?: LoginToastSize;
      toastType?: LoginToastType;
    }>
  >("/auth/login", props, {
    withCredentials: true,
  });

  return {
    isFirstLogin: Boolean(response.data.data.isFirstLogin),
    serverMessage: response.data.message ?? "",
    // MSW toast 테스트처럼 서버가 타입을 내려주는 경우에만 성공 콜백에서 toast를 노출합니다.
    toastDescription: response.data.data.toastDescription,
    toastSize: response.data.data.toastSize,
    toastType: response.data.data.toastType,
    token: response.data.data.accessToken,
  };
};

/** 이메일 로그인 */
export const useEmailLoginMutation = () => {
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  return useMutation<
    {
      isFirstLogin: boolean;
      serverMessage: string;
      toastDescription?: string;
      toastSize?: LoginToastSize;
      toastType?: LoginToastType;
      token: string;
    },
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
