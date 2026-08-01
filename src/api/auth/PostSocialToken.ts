import { useMutation } from "@tanstack/react-query";
import { plainAxios } from "..";
import { useAuthStore } from "@/store/useAuthStore";

interface SocialTokenResponse {
  accessToken?: string;
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
