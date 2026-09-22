import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RefundRequested } from "@/type/payment";
import { qnaQueryKeys } from "@/api/qna/queryKeys";
import { paymentQueryKeys } from "./queryKeys";

interface PostPaymentRefundParams {
  orderUid: string;
  reason?: string;
}

/** 환불 신청 결과. 같은 결제로 다시 신청하면 서버는 새로 만들지 않고 기존 결과를 200 으로 돌려준다(멱등). */
export interface PaymentRefundResult extends RefundRequested {
  /** 이미 신청된 결제라 기존 환불 · 문의를 그대로 돌려받았는지 */
  isExisting: boolean;
}

const postPaymentRefund = async ({
  orderUid,
  reason,
}: PostPaymentRefundParams): Promise<PaymentRefundResult> => {
  const response = await authAxios.post<RefundRequested>(
    `/payments/orders/${orderUid}/cancel`,
    { reason: reason || null },
  );

  // 새로 접수하면 201, 이미 있던 환불을 돌려주면 200 이다.
  return { ...response.data, isExisting: response.status === 200 };
};

/**
 * 환불 신청. 접수만 되고 돈과 노트는 관리자 승인 뒤에 움직입니다.
 * 서버가 환불 문의를 함께 열므로 내 문의 목록과 결제 목록(신청 여부 표시)을 다시 받습니다.
 */
export const usePaymentRefundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentRefundResult, AppError, PostPaymentRefundParams>({
    mutationKey: ["post-payment-refund"],
    mutationFn: postPaymentRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.mine() });
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.orders() });
    },
  });
};
