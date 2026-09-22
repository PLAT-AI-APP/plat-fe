/** 캐시 사용 내역 관련 캐시 키의 단일 출처. */
export const noteQueryKeys = {
  /** 크기와 상관없이 사용 내역 목록 전체. 노트가 늘거나 줄면 이 키로 무효화한다. */
  usageHistoryLists: () => ["get-usage-history-list"] as const,
  usageHistoryList: (size?: number) =>
    [...noteQueryKeys.usageHistoryLists(), size] as const,
};
