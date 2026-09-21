import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { PaymentOrder } from "@/type/payment";
import { paymentQueryKeys } from "./queryKeys";

/** 결제 주문 단건 조회. 승인 응답이 끊겼을 때 결과를 되짚는 데 씁니다. */
export const getPaymentOrder = async (orderUid: string) => {
  const response = await authAxios.get<PaymentOrder>(
    `/payments/orders/${orderUid}`,
  );

  return response.data;
};

/** 결제 주문 단건 조회 훅. 환불 신청 전 주문 정보를 보여줄 때 씁니다. */
export const usePaymentOrderQuery = (orderUid: string) => {
  return useQuery<PaymentOrder, AppError>({
    queryKey: paymentQueryKeys.order(orderUid),
    queryFn: () => getPaymentOrder(orderUid),
  });
};
