import { useAuthStore } from "@/store/useAuthStore";

/**
 * 인증 상태 확인이 끝난 뒤의 로그인 여부.
 * isAuthReady 없이 isLoggedIn만 보면 새로고침 직후 잠깐 비로그인으로 오판할 수 있습니다.
 */
export const useAuthReady = () => {
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return isAuthReady && isLoggedIn;
};
