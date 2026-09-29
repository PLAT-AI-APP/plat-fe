import type { QueryClient } from "@tanstack/react-query";
import { rankingQueryKeys } from "@/api/ranking/queryKeys";
import { userQueryKeys } from "@/api/user/queryKeys";
import { universeQueryKeys } from "./queryKeys";

/**
 * 세계관 카드가 실리는 홈 섹션 키의 첫 항목들(homeQueryKeys 참고). 배너처럼 세계관 목록이 아닌 것은 뺀다.
 * 홈 키는 섹션마다 루트가 달라 접두사 하나로 무효화할 수 없다.
 */
const HOME_UNIVERSE_LIST_ROOTS = new Set<unknown>([
  "get-today-pick",
  "get-popular-tag",
  "get-new-work",
  "get-asset-preview",
  "get-all-characters",
  "get-official-preview",
  "get-user-recommend",
]);

/**
 * 세계관을 만들거나 고친 뒤, 그 세계관이 보일 수 있는 목록을 다시 받게 한다.
 * 내 프로필의 세계관 목록·홈·랭킹·상세가 예전 제목·이미지·공개 여부를 들고 있지 않게 하려는 것이다.
 */
export const invalidateUniverseLists = (
  queryClient: QueryClient,
  universeId?: string,
) => {
  void queryClient.invalidateQueries({ queryKey: ["get-user-universes"] });
  void queryClient.invalidateQueries({ queryKey: userQueryKeys.likedUniverses() });
  void queryClient.invalidateQueries({ queryKey: rankingQueryKeys.all() });
  void queryClient.invalidateQueries({
    predicate: (query) => HOME_UNIVERSE_LIST_ROOTS.has(query.queryKey[0]),
  });
  if (universeId) {
    void queryClient.invalidateQueries({
      queryKey: universeQueryKeys.detail(universeId),
    });
  }
};
