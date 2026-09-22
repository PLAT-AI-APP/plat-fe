import type { SliceWith } from "./api";

/** POST /payments/orders 응답. 이동 주소가 있으면(카카오페이) 그 결제창으로 보냅니다. */
export interface PaymentOrderCreated {
  orderUid: string;
  pgProvider: string;
  amountMinor: number;
  currency: string;
  creditAmount: number;
  expiresAt: string;
  redirectPcUrl: string | null;
  redirectMobileUrl: string | null;
}

/** 결제 건에 걸린 가장 최근 환불의 상태. 환불이 없었으면 null 이다. */
export type PaymentRefundStatus =
  | "REQUESTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REJECTED";

/** GET /payments/orders 목록 한 줄이자 GET /payments/orders/{orderUid} 응답 */
export interface PaymentOrder {
  orderUid: string;
  productName: string;
  amountMinor: number;
  currency: string;
  creditAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  paidAt: string | null;
  /** 환불을 신청할 수 있는 마지막 시각. 승인 전이면 비어 있습니다. */
  refundableUntil: string | null;
  refundedAmountMinor: number;
  refundStatus: PaymentRefundStatus | null;
}

export type PaymentOrderListResponse = SliceWith<PaymentOrder>;

/** POST /payments/orders/{orderUid}/cancel 응답. 접수만 되고 관리자가 승인해야 환불됩니다. */
export interface RefundRequested {
  refundId: string;
  refundUid: string;
  status: string;
  /** 함께 열린 환불 문의 */
  qnaId: string | null;
}

/** POST /payments/orders/{orderUid}/confirm 응답 */
export interface PaymentConfirmed {
  orderUid: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  creditAmount: number;
  paidAt: string | null;
}
