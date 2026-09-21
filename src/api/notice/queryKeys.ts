import type { NoticeCategory } from "@/type/notice";

/** 공지사항 관련 캐시 키의 단일 출처. */
export const noticeQueryKeys = {
  /** 분류별로 서버에서 따로 받으므로 분류마다 캐시가 갈린다. 전체는 "ALL" 로 구분한다. */
  list: (category?: NoticeCategory | null) =>
    ["get-notice-list", category ?? "ALL"] as const,
  detail: (noticeId?: string) =>
    ["get-notice-detail-contents", noticeId] as const,
};
