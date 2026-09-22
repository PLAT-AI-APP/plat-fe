import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { PaymentOrderListResponse } from "@/type/payment";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { paymentQueryKeys } from "./queryKeys";

interface GetPaymentOrderListParams {
  page?: number;
  size?: number;
}

const getPaymentOrderList = async ({ page = 0, size = 10 }: GetPaymentOrderListParams) => {
  const response = await authAxios.get<PaymentOrderListResponse>("/payments/orders", {
    params: { page, size },
  });

  return response.data;
};

/** 내 결제 목록(최신순). 나의 Q&A 환불 요청에서 환불할 결제를 고를 때 쓴다. */
export const usePaymentOrderListQuery = ({ size }: GetPaymentOrderListParams) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<PaymentOrderListResponse, AppError>({
    queryKey: paymentQueryKeys.orderList(size),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getPaymentOrderList({ page: pageParam as number, size }),
    getNextPageParam: getNextPageNumber,
    enabled: authReady,
  });
};
