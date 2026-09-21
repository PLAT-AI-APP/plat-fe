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

/** GET /payments/orders/{orderUid} 응답 중 결제 확인에 쓰는 값 */
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
}

/** POST /payments/orders/{orderUid}/cancel 응답. 접수만 되고 관리자가 승인해야 환불됩니다. */
export interface RefundRequested {
  refundId: string;
  refundUid: string;
  status: string;
}

/** POST /payments/orders/{orderUid}/confirm 응답 */
export interface PaymentConfirmed {
  orderUid: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  creditAmount: number;
  paidAt: string | null;
}
