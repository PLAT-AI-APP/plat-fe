import { useAuthStore } from "@/store/useAuthStore";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { hasAdultAccess, hasAdultMode } from "@/lib/adultAccess";

/**
 * 성인 세계관·방에 들어갈 수 있는지(로그인 + 성인인증 유효). 상세·채팅처럼 "접근"이 갈리는 조회의 캐시 키에 넣는다.
 * 토큰 클레임 기준이라 서버 판단과 같고, 새로고침 직후 /users/me 를 기다리지 않는다.
 */
export const useAdultAccess = () => {
  const authReady = useAuthReady();
  const accessToken = useAuthStore((state) => state.accessToken);

  return authReady && hasAdultAccess(accessToken);
};

/**
 * 목록에 성인 콘텐츠가 섞이는지(로그인 + 성인인증 유효 + 19 토글 ON). 목록·검색·랭킹 캐시 키에 넣어
 * 토글을 바꾸면 다른 캐시를 쓰게 한다.
 */
export const useAdultMode = () => {
  const authReady = useAuthReady();
  const accessToken = useAuthStore((state) => state.accessToken);

  return authReady && hasAdultMode(accessToken);
};
