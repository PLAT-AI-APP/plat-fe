"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { paymentQueryKeys } from "./queryKeys";

const getFirstPurchaseEligibility = async () => {
  const response = await authAxios.get<{ eligible: boolean }>(
    "/payments/orders/first-purchase",
  );

  return response.data;
};

/** 첫 구매 상품 대상 여부. 결제 완료 이력이 하나라도 있으면(환불했어도) false 다. */
export const useFirstPurchaseEligibilityQuery = () => {
  const authReady = useAuthReady();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<{ eligible: boolean }, AppError>({
    queryKey: paymentQueryKeys.firstPurchase(),
    queryFn: getFirstPurchaseEligibility,
    enabled: authReady && !!accessToken,
    // 못 받으면 첫 구매 상품만 숨기고 나머지 목록은 그대로 보여준다. 토스트까지 띄울 일은 아니다.
    meta: { silent: true },
  });
};
