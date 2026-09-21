import { authAxios } from "..";
import type { PaymentOrder } from "@/type/payment";

/** 결제 주문 단건 조회. 승인 응답이 끊겼을 때 결과를 되짚는 데 씁니다. */
export const getPaymentOrder = async (orderUid: string) => {
  const response = await authAxios.get<PaymentOrder>(
    `/payments/orders/${orderUid}`,
  );

  return response.data;
};
