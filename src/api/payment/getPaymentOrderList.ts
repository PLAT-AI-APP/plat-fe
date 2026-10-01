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
  /** true 면 결제가 확정된(paidAt 이 있는) 주문만 받는다. 결제창을 닫은 미결제 주문은 환불할 대상이 아니다. */
  paidOnly?: boolean;
}

const getPaymentOrderList = async ({
  page = 0,
  size = 10,
  paidOnly = false,
}: GetPaymentOrderListParams) => {
  const response = await authAxios.get<PaymentOrderListResponse>("/payments/orders", {
    params: { page, size, ...(paidOnly && { paidOnly: true }) },
  });

  return response.data;
};

/** 내 결제 목록(최신순). 나의 Q&A 환불 요청에서 환불할 결제를 고를 때 쓴다. */
export const usePaymentOrderListQuery = ({
  size,
  paidOnly = false,
}: GetPaymentOrderListParams) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<PaymentOrderListResponse, AppError>({
    queryKey: paymentQueryKeys.orderList(size, paidOnly),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getPaymentOrderList({ page: pageParam as number, size, paidOnly }),
    getNextPageParam: getNextPageNumber,
    enabled: authReady,
  });
};
