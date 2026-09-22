import type { SliceWith } from "./api";

/** 신고할 수 있는 대상. 새 대상이 생기면 신고 내역의 대상 라벨(report.targetTypes)도 함께 늘린다. */
export const REPORT_TARGET_TYPES = ["COMMENT", "UNIVERSE"] as const;
export type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number];

/** 신고 모달의 사유 칩이 이 순서대로 놓인다. 기타(ETC)는 상세 입력이 필수라 맨 뒤에 둔다. */
export const REPORT_REASONS = [
  "SEXUAL",
  "VIOLENCE",
  "HATE",
  "COPYRIGHT",
  "SPAM",
  "ETC",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/** 신고가 속한 케이스의 상태. 신고자에게는 판정 내용 없이 이 값만 내려온다. */
export type ReportCaseStatus = "PENDING" | "ACTIONED" | "DISMISSED";

/** POST /reports 요청 */
export interface ReportCreateRequest {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  /** ETC 면 필수. 비어 있으면 보내지 않는다. */
  detail?: string;
}

/** POST /reports 응답(201) */
export interface ReportCreated {
  reportId: string;
}

/** GET /reports/me 목록 한 줄이자 GET /reports/me/{reportId} 응답 */
export interface MyReportItem {
  reportId: string;
  targetType: ReportTargetType;
  targetId: string;
  /** 신고 순간의 스냅샷. 원본이 지워져도 신고자가 무엇을 신고했는지 알아볼 수 있게 한다. */
  target: {
    /** 세계관 제목, 댓글이면 댓글이 달린 세계관 제목 */
    title: string;
    /** 댓글 본문·세계관 소개 일부(최대 100자) */
    excerpt: string;
  };
  reason: ReportReason;
  detail?: string;
  status: ReportCaseStatus;
  createdAt: string;
  /** 처리된 뒤에만 온다. */
  handledAt?: string;
}

export type MyReportListResponse = SliceWith<MyReportItem>;
