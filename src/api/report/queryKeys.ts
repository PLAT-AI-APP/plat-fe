/** 신고 관련 캐시 키의 단일 출처. */
export const reportQueryKeys = {
  /** 내 신고 목록·단건을 한 번에 무효화할 때 쓰는 접두사 */
  mine: () => ["get-my-report"] as const,
  myList: (size?: number) => [...reportQueryKeys.mine(), "list", size] as const,
  myDetail: (reportId: string) =>
    [...reportQueryKeys.mine(), "detail", reportId] as const,
};
