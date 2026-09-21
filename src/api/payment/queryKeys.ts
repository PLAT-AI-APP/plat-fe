/** 결제 관련 캐시 키의 단일 출처. */
export const paymentQueryKeys = {
  order: (orderUid: string) => ["get-payment-order", orderUid] as const,
};
