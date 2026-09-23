import { useMutation } from "@tanstack/react-query";
import { plainAxios } from "..";
import { useAuthStore } from "@/store/useAuthStore";

interface SocialTokenResponse {
  accessToken?: string;
  isNew?: boolean;
  /** 이번 로그인으로 지급되는 웰컴 크레딧. 최초 로그인이 아니거나 정책이 꺼져 있으면 null */
  welcomeCredit?: number | null;
}

export const postSocialToken = async (code: string) => {
  const response = await plainAxios.post<SocialTokenResponse>(
    "/auth/social/token",
    { code },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

/** 소셜 토큰 검증 및 로그인 */
export const useSocialTokenMutation = () => {
  // 리액트 커스텀 훅 내부이므로 useAuthStore를 안전하게 사용할 수 있습니다.
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  return useMutation({
    mutationFn: postSocialToken,
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        setLoggedIn(true);
      }
    },
    onError: (error) => {
      console.error("소셜 로그인 토큰 발급 실패:", error);
    },
  });
};
