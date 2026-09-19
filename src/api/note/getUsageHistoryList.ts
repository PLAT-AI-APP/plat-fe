import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { WalletLedgerListResponse } from "@/type/note";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { noteQueryKeys } from "./queryKeys";

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
  const authReady = useAuthReady();

  return useInfiniteQuery<WalletLedgerListResponse, AppError>({
    queryKey: noteQueryKeys.usageHistoryList(size),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getUsageHistoryList({ page: pageParam as number, size }),
    getNextPageParam: getNextPageNumber,
    enabled: authReady,
  });
};
