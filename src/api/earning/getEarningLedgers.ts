import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { EarningLedgerListResponse } from "@/type/earning";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getEarningLedgers = async (
  month: string,
  page: number,
  size?: number,
) => {
  const response = await authAxios.get<EarningLedgerListResponse>(
    "/earnings/ledgers",
    { params: { month, page, size } },
  );
  return response.data;
};

/** 한 달(YYYY-MM, KST) 수익 포인트 내역 조회 */
export const useEarningLedgersQuery = ({
  month,
  size,
}: {
  month: string;
  size?: number;
}) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<EarningLedgerListResponse, AppError>({
    queryKey: earningQueryKeys.ledgerList(month, size),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getEarningLedgers(month, pageParam as number, size),
    getNextPageParam: getNextPageNumber,
    enabled: authReady,
  });
};
