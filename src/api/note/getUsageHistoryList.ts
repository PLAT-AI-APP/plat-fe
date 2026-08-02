import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { WalletLedgerListResponse } from "@/type/note";

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
    getNextPageParam: (lastPage) => {
      return lastPage.page.hasNext ? lastPage.page.number + 1 : null;
    },
    staleTime: 1000 * 60 * 5,
  });
};
