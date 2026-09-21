/** 캐시 사용 내역 관련 캐시 키의 단일 출처. */
export const noteQueryKeys = {
  usageHistoryList: (size?: number) =>
    ["get-usage-history-list", size] as const,
};
