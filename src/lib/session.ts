import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";

/**
 * React 밖(axios 인터셉터)에서도 캐시를 비울 수 있게 앱의 QueryClient 를 기억해 둔다.
 * ReactQueryProvider 가 만들 때 한 번 등록한다.
 */
let sessionQueryClient: QueryClient | null = null;

export const registerSessionQueryClient = (queryClient: QueryClient) => {
  sessionQueryClient = queryClient;
};

interface ClearSessionOptions {
  /**
   * - logout: 사용자가 로그아웃했다(또는 다른 탭에서 로그아웃했다). 로그인에 딸린 캐시를 전부 비운다.
   *   뒤이어 화면을 옮기거나 새로 그리므로 지금 떠 있는 조회까지 지워도 된다.
   * - expired: 쓰는 도중 세션이 끊겼다. 지금 화면의 조회는 인터셉터가 비로그인으로 다시 받는 중이라
   *   건드리지 않고, 화면에 없는(다른 페이지의) 캐시만 버린다 — 떠 있는 조회를 지우면 받은 응답이 갈 곳을 잃는다.
   */
  reason: "logout" | "expired";
}

/**
 * 로그아웃·세션 만료 때 클라이언트에 남은 로그인 흔적을 한 번에 지운다.
 *
 * 인증 상태만 비우면 새로고침 뒤에도 내 닉네임·프로필(user-storage)이 헤더에 남고, 잔액과
 * 내 채팅 목록 같은 캐시가 다음 사람에게 보였다. 정리할 곳이 늘면 여기에만 더한다.
 */
export const clearSession = ({ reason }: ClearSessionOptions) => {
  const { isLoggedIn, accessToken, logout } = useAuthStore.getState();
  const hadSession =
    isLoggedIn || Boolean(accessToken) || useUserStore.getState().user !== null;

  logout();
  useUserStore.getState().clearUser();
  useWalletStore.getState().clearBalance();

  // 이미 비운 뒤 늦게 도착한 만료 응답들은 캐시를 다시 건드리지 않는다.
  if (!hadSession || !sessionQueryClient) return;

  if (reason === "logout") {
    sessionQueryClient.clear();
  } else {
    sessionQueryClient.removeQueries({ type: "inactive" });
  }
};
