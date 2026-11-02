/** 검수 상태 캐시 키의 단일 출처. */
export const reviewQueryKeys = {
  all: () => ["get-content-review"] as const,
  universe: (universeId?: string) =>
    ["get-content-review", "UNIVERSE", universeId] as const,
};
