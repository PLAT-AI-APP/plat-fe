/** 제작자 수익 관련 캐시 키의 단일 출처. 교환·전환하면 요약·내역을 함께 무효화한다. */
export const earningQueryKeys = {
  all: () => ["earning"] as const,
  summary: () => [...earningQueryKeys.all(), "summary"] as const,
  ledgers: () => [...earningQueryKeys.all(), "ledgers"] as const,
  /** month: YYYY-MM(KST) */
  ledgerList: (month: string, size?: number) =>
    [...earningQueryKeys.ledgers(), month, size] as const,
  rewardProducts: () => [...earningQueryKeys.all(), "reward-products"] as const,
};
