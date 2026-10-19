/** 제작자 수익 관련 캐시 키의 단일 출처. 교환·전환하면 요약·전환 내역을 함께 무효화한다. */
export const earningQueryKeys = {
  all: () => ["earning"] as const,
  summary: () => [...earningQueryKeys.all(), "summary"] as const,
  exchanges: () => [...earningQueryKeys.all(), "exchanges"] as const,
  /** month: YYYY-MM(KST) */
  exchangeList: (month: string, size?: number) =>
    [...earningQueryKeys.exchanges(), month, size] as const,
  redemption: (redemptionNo: string) =>
    [...earningQueryKeys.all(), "redemption", redemptionNo] as const,
  calendar: (month: string) =>
    [...earningQueryKeys.all(), "calendar", month] as const,
  calendarDay: (date: string, selection: number) =>
    [...earningQueryKeys.all(), "calendar-day", date, selection] as const,
  universes: () => [...earningQueryKeys.all(), "universes"] as const,
  universeList: (params: {
    sort: string;
    direction: string;
    keyword: string;
    page: number;
    size: number;
  }) => [...earningQueryKeys.universes(), params] as const,
  universe: (universeId: string) =>
    [...earningQueryKeys.all(), "universe", universeId] as const,
  universeDays: (universeId: string, month: string) =>
    [...earningQueryKeys.universe(universeId), "days", month] as const,
  rewardProducts: () => [...earningQueryKeys.all(), "reward-products"] as const,
  deliveryChannels: () =>
    [...earningQueryKeys.all(), "delivery-channels"] as const,
  tier: () => [...earningQueryKeys.all(), "tier"] as const,
};
