import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { EarningLedgerListResponse } from "@/type/earning";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getEarningExchanges = async (
  month: string,
  page: number,
  size?: number,
) => {
  const response = await authAxios.get<EarningLedgerListResponse>(
    "/earnings/exchanges",
    { params: { month, page, size } },
  );
  return response.data;
};

/** 한 달(YYYY-MM, KST) 전환 내역(교환 · 소멸 · 운영 지급/차감) 조회 */
export const useEarningExchangesQuery = ({
  month,
  size,
}: {
  month: string;
  size?: number;
}) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<EarningLedgerListResponse, AppError>({
    queryKey: earningQueryKeys.exchangeList(month, size),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getEarningExchanges(month, pageParam as number, size),
    getNextPageParam: getNextPageNumber,
    enabled: authReady,
  });
};
