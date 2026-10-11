import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import type { AppError } from "..";
import { useAuthStore } from "@/store/useAuthStore";

export interface SocialSignupRequest {
  /** 소셜 인증 뒤 `/auth/callback?signup=` 으로 받은 가입 토큰(10분, 1회용). */
  signupToken: string;
  termsOfService: boolean;
  privacyPolicy: boolean;
  ageOver14: boolean;
  marketing: boolean;
}

export interface SocialSignupResponse {
  accessToken: string;
  isNew: boolean;
  /** 가입으로 지급되는 웰컴 크레딧. 정책이 꺼져 있으면 null */
  welcomeCredit: number | null;
}

/** 가입 토큰 만료·재사용(401). 소셜 로그인부터 다시 해야 한다. */
export const SOCIAL_CODE_EXPIRED = "SOCIAL_CODE_EXPIRED";

const postSocialSignup = async (request: SocialSignupRequest) => {
  // 이메일 로그인과 같다 — 기기 ID 를 싣고 refresh 쿠키를 받는다.
  const response = await axiosInstance.post<SocialSignupResponse>(
    "/auth/social/signup",
    request,
    { withCredentials: true },
  );
  return response.data;
};

/**
 * 소셜 가입 마무리. 동의를 보내야 그때 계정이 생기고 토큰이 나온다 — 동의 전에는 로그인된 상태가 아니다.
 */
export const useSocialSignupMutation = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  return useMutation<SocialSignupResponse, AppError, SocialSignupRequest>({
    mutationFn: postSocialSignup,
    // 실패는 동의 창·콜백 화면이 직접 알린다.
    meta: { silent: true },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setLoggedIn(true);
    },
  });
};
