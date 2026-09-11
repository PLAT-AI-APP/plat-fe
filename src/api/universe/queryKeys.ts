/** 세계관 관련 캐시 키의 단일 출처. */
export const universeQueryKeys = {
  detail: (universeId?: string) => ["get-universe-detail", universeId] as const,
};
