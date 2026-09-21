import { authAxios } from "..";
import type { PaymentConfirmed } from "@/type/payment";
import { getPaymentOrder } from "./getPaymentOrder";

interface PaymentConfirmParams {
  orderUid: string;
  /** 결제창이 돌려준 승인 토큰(카카오페이 pg_token) */
  pgToken: string;
}

/** 새로고침으로 다시 불려도 같은 승인 요청으로 보이도록 주문마다 멱등키를 하나만 씁니다. */
const idempotencyKeyOf = (orderUid: string) => {
  const storageKey = `payment-confirm:${orderUid}`;
  const saved = sessionStorage.getItem(storageKey);
  if (saved) return saved;

  const created = crypto.randomUUID();
  sessionStorage.setItem(storageKey, created);
  return created;
};

/** 결제 승인. 금액은 대조용이라 서버가 정한 주문 금액을 다시 읽어 그대로 보냅니다. */
export const postPaymentConfirm = async ({
  orderUid,
  pgToken,
}: PaymentConfirmParams) => {
  const order = await getPaymentOrder(orderUid);

  const response = await authAxios.post<PaymentConfirmed>(
    `/payments/orders/${orderUid}/confirm`,
    {
      pgTransactionId: pgToken,
      amountMinor: order.amountMinor,
      idempotencyKey: idempotencyKeyOf(orderUid),
    },
  );

  return response.data;
};
