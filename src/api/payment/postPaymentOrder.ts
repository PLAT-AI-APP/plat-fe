import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { PaymentOrderCreated } from "@/type/payment";

/** plat-fe는 웹 클라이언트만 서빙하므로 플랫폼은 항상 WEB으로 고정합니다. */
const CLIENT_PLATFORM = "WEB";

const postPaymentOrder = async (productId: number) => {
  const response = await authAxios.post<PaymentOrderCreated>(
    "/payments/orders",
    { productId, platform: CLIENT_PLATFORM },
    { headers: { "X-Client-Platform": CLIENT_PLATFORM } },
  );

  return response.data;
};

/** 결제 주문 생성. 서버가 PG 결제 준비까지 마치고 결제창 주소를 돌려줍니다. */
export const usePostPaymentOrderMutation = () => {
  return useMutation<PaymentOrderCreated, AppError, number>({
    mutationKey: ["post-payment-order"],
    mutationFn: postPaymentOrder,
  });
};
