import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { WalletLedgerListResponse } from "@/type/note";
import { getNextPageNumber } from "@/lib/pagination";

interface GetUsageHistoryListProps {
  page?: number;
  size?: number;
}

const getUsageHistoryList = async ({
  page,
  size,
}: GetUsageHistoryListProps) => {
  const response = await authAxios.get<WalletLedgerListResponse>(
    "/wallet/ledgers",
    {
      params: {
        page,
        size,
      },
    },
  );

  return response.data;
};

/** 노트 사용내역 조회 */
export const useUsageHistoryListQuery = ({
  size,
}: GetUsageHistoryListProps) => {
  return useInfiniteQuery<WalletLedgerListResponse, AppError>({
    queryKey: ["get-usage-history-list", size],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getUsageHistoryList({ page: pageParam as number, size }),
    getNextPageParam: getNextPageNumber,
  });
};
