/** 결제 관련 캐시 키의 단일 출처. */
export const paymentQueryKeys = {
  order: (orderUid: string) => ["get-payment-order", orderUid] as const,
  /** 내 결제 목록. 환불 신청 뒤 신청 여부 표시를 다시 받으려고 접두사로 무효화한다. */
  orders: () => ["get-payment-order-list"] as const,
  orderList: (size?: number, paidOnly?: boolean) =>
    [...paymentQueryKeys.orders(), size, paidOnly] as const,
  /** 첫 구매 상품 대상 여부. 결제가 끝나거나 서버가 이미 썼다고 답하면 무효화한다. */
  firstPurchase: () => ["get-first-purchase-eligibility"] as const,
};
