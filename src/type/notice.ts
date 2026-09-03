/** 공지 분류. 백엔드 NoticeCategory와 값이 1:1로 대응합니다. */
export type NoticeCategory =
  "SERVICE" | "UPDATE" | "EVENT" | "MAINTENANCE" | "POLICY";

/** 공지 목록 한 줄. 본문은 상세에서만 내려옵니다. */
export interface NoticeSummary {
  noticeId: string;
  category: NoticeCategory;
  title: string;
  isPinned: boolean;
  createdAt: string;
}

/** 공지 상세 */
export interface NoticeDetail {
  noticeId: string;
  category: NoticeCategory;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string | null;
}
