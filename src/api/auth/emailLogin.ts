import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { AppToastSize, AppToastType } from "@/lib/toast";

export type LoginToastSize = AppToastSize;
export type LoginToastType = AppToastType;

interface PostEmailLoginProps {
  username: string;
  password: string;
}

interface EmailLoginResponse {
  accessToken?: string;
  isFirstLogin?: boolean;
  token?: string;
  toastDescription?: string;
  toastMessage?: string;
  toastSize?: LoginToastSize;
  toastType?: LoginToastType;
}

/** Authorization 헤더와 응답 body를 모두 지원하는 토큰 추출 */
const getAccessTokenFromLoginResponse = (
  authorizationHeader?: string,
  accessToken?: string,
  token?: string,
) => {
  if (accessToken) {
    return accessToken;
  }

  if (token) {
    return token;
  }

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.replace("Bearer ", "");
  }

  return authorizationHeader;
};

const PostEmailLogin = async (props: PostEmailLoginProps) => {
  const response = await axiosInstance.post<EmailLoginResponse>(
    "/auth/login",
    props,
    {
      withCredentials: true,
    },
  );
  const responseData = response.data;
  const token = getAccessTokenFromLoginResponse(
    response.headers.authorization,
    responseData?.accessToken,
    responseData?.token,
  );

  if (!token) {
    throw {
      code: "MESSAGE",
      fields: {},
      message: "로그인 응답에서 토큰을 찾을 수 없습니다.",
    } satisfies AppError;
  }

  return {
    isFirstLogin: Boolean(responseData?.isFirstLogin),
    // MSW toast 테스트 계정에서만 내려주는 검수용 필드
    toastDescription: responseData?.toastDescription,
    toastMessage: responseData?.toastMessage,
    toastSize: responseData?.toastSize,
    toastType: responseData?.toastType,
    token,
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
      toastDescription?: string;
      toastMessage?: string;
      toastSize?: LoginToastSize;
      toastType?: LoginToastType;
      token: string;
    },
    AppError,
    PostEmailLoginProps
  >({
    mutationFn: PostEmailLogin,
    onSuccess: (data) => {
      setAccessToken(data.token);
      setLoggedIn(true);
      // 로그인 성공 UI 흐름을 막지 않도록 내 정보 갱신은 백그라운드로 실행
      void queryClient.invalidateQueries({ queryKey: ["get-my-info"] });
    },
  });
};
