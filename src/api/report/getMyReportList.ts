import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { MyReportListResponse } from "@/type/report";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { reportQueryKeys } from "./queryKeys";

interface GetMyReportListParams {
  page?: number;
  size?: number;
}

const getMyReportList = async ({ page, size }: GetMyReportListParams) => {
  const response = await authAxios.get<MyReportListResponse>("/reports/me", {
    params: { page, size },
  });

  return response.data;
};

/** 내 신고 내역(최신 신고 순) */
export const useMyReportListQuery = ({ size }: GetMyReportListParams) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<MyReportListResponse, AppError>({
    queryKey: reportQueryKeys.myList(size),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getMyReportList({ page: pageParam as number, size }),
    getNextPageParam: getNextPageNumber,
    enabled: authReady,
  });
};
