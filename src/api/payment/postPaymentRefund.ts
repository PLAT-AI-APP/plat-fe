import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RefundRequested } from "@/type/payment";

interface PostPaymentRefundParams {
  orderUid: string;
  reason?: string;
}

const postPaymentRefund = async ({ orderUid, reason }: PostPaymentRefundParams) => {
  const response = await authAxios.post<RefundRequested>(
    `/payments/orders/${orderUid}/cancel`,
    { reason: reason || null },
  );

  return response.data;
};

/** 환불 신청. 접수만 되고 돈과 노트는 관리자 승인 뒤에 움직입니다. */
export const usePaymentRefundMutation = () => {
  return useMutation<RefundRequested, AppError, PostPaymentRefundParams>({
    mutationKey: ["post-payment-refund"],
    mutationFn: postPaymentRefund,
  });
};
