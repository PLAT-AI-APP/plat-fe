import type { SliceWith } from "./api";

/**
 * 고객센터 Q&A.
 *
 * Q&A는 유저와 운영팀 사이의 상담 창구다. 유저는 내부 처리(노트 회수, PG 취소 등)를 몰라도 되고
 * 결과만 답변으로 받는다. 환불 신청도 여기로 들어온다 — 신청하면 서버가 `REFUND` 문의를 열고,
 * 결과(거절 사유 포함)는 운영팀이 답변으로 직접 단다.
 */

/** 유저가 직접 고를 수 있는 문의 유형. 환불은 환불 신청으로만 생기므로 여기 없다. */
export const QNA_WRITABLE_CATEGORIES = [
  "ACCOUNT",
  "PAYMENT",
  "CHARACTER",
  "BUG",
  "ETC",
] as const;
export type QnaWritableCategory = (typeof QNA_WRITABLE_CATEGORIES)[number];
export type QnaCategory = "REFUND" | QnaWritableCategory;

/** OPEN: 답변 대기 · ANSWERED: 답변 완료 */
export type QnaStatus = "OPEN" | "ANSWERED";

/**
 * 유저에게 보이는 환불 진행 상태.
 * 서버의 `RefundStatus`와 같은 값이지만 `FAILED`(PG 거절)는 운영팀이 다시 처리할 일이라
 * 유저에게는 진행 중과 같은 뜻으로 보인다.
 */
/** 환불 문의에 묶인 신청 내역. 환불 진행 상태 · 결과는 담지 않는다 — 결과는 운영팀 답변으로 온다. */
export interface QnaRefundSummary {
  orderUid: string;
  productName: string;
  amountMinor: number;
  currency: string;
  creditAmount: number;
}

/** GET /qna/me 목록 한 줄이자 GET /qna/me/{qnaId} 응답 */
export interface MyQnaItem {
  qnaId: string;
  category: QnaCategory;
  title: string;
  content: string;
  status: QnaStatus;
  createdAt: string;
  /** 운영팀이 직접 쓴 답변. 환불 결과도 여기로 온다. */
  answer: string | null;
  answeredAt: string | null;
  /** `REFUND` 문의에만 있고 나머지는 null 이다. */
  refund: QnaRefundSummary | null;
}

export type MyQnaListResponse = SliceWith<MyQnaItem>;

/** POST /qna 요청 */
export interface QnaCreateRequest {
  category: QnaWritableCategory;
  title: string;
  content: string;
}

/** POST /qna 응답(201) */
export interface QnaCreated {
  qnaId: string;
}

/** 자주 하는 질문 */
export const FAQ_CATEGORIES = [
  "REFUND",
  "PAYMENT",
  "ACCOUNT",
  "CHARACTER",
  "CHAT",
  "ETC",
] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

/** GET /faqs 응답 한 줄. 노출 중인 항목만 카테고리 → 정렬 순서로 내려온다. */
export interface FaqItem {
  faqId: string;
  category: FaqCategory;
  question: string;
  answer: string;
}
