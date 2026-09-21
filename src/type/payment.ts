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
}

/** POST /payments/orders/{orderUid}/confirm 응답 */
export interface PaymentConfirmed {
  orderUid: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  creditAmount: number;
  paidAt: string | null;
}
