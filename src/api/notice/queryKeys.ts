/** 공지사항 관련 캐시 키의 단일 출처. */
export const noticeQueryKeys = {
  list: () => ["get-notice-list"] as const,
  detail: (noticeId?: string) =>
    ["get-notice-detail-contents", noticeId] as const,
};
