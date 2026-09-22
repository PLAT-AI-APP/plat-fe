/** 결제 관련 캐시 키의 단일 출처. */
export const paymentQueryKeys = {
  order: (orderUid: string) => ["get-payment-order", orderUid] as const,
  /** 내 결제 목록. 환불 신청 뒤 신청 여부 표시를 다시 받으려고 접두사로 무효화한다. */
  orders: () => ["get-payment-order-list"] as const,
  orderList: (size?: number) => [...paymentQueryKeys.orders(), size] as const,
};
