import type { QueryClient } from "@tanstack/react-query";
import { rankingQueryKeys } from "@/api/ranking/queryKeys";
import { roomQueryKeys } from "@/api/room/queryKeys";
import { userQueryKeys } from "@/api/user/queryKeys";

/**
 * 성인 콘텐츠 노출·접근에 따라 응답이 달라지는 조회의 첫 키. 목록은 키에 adultMode 가 있어 토글하면
 * 자동으로 다른 캐시를 쓰지만, 같은 키로 돌아왔을 때 예전 응답을 보이지 않도록 함께 다시 받는다.
 */
const ADULT_SCOPED_ROOTS = new Set<unknown>([
  "get-today-pick",
  "get-popular-tag",
  "get-new-work",
  "get-asset-preview",
  "get-all-characters",
  "get-official-preview",
  "get-user-recommend",
  "get-home-banners",
  "get-search",
  "get-category-search",
  "get-popular-search-terms",
  "get-hashtag-list",
  "get-user-universes",
  "get-universe-detail",
  // 성인인증이 만료된 방은 잠긴 채(locked) 오거나 403 으로 막힌다. 인증을 마치면 다시 열려야 한다.
  "get-room-detail",
  "get-room-messages",
  "get-room-memory",
  "get-room-user-note",
]);

/** 19 토글을 바꾸거나 본인·성인인증을 마친 뒤 부른다. */
export const invalidateAdultScopedQueries = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({
    predicate: (query) => ADULT_SCOPED_ROOTS.has(query.queryKey[0]),
  });
  void queryClient.invalidateQueries({ queryKey: rankingQueryKeys.all() });
  void queryClient.invalidateQueries({ queryKey: userQueryKeys.likedUniverses() });
  void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
  void queryClient.invalidateQueries({ queryKey: userQueryKeys.myInfo() });
};
