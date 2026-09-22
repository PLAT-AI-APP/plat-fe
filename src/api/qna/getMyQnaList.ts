import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { MyQnaListResponse } from "@/type/qna";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { qnaQueryKeys } from "./queryKeys";

interface GetMyQnaListParams {
  page?: number;
  size?: number;
}

const getMyQnaList = async ({ page = 0, size = 20 }: GetMyQnaListParams) => {
  const response = await authAxios.get<MyQnaListResponse>("/qna/me", {
    params: { page, size },
  });

  return response.data;
};

/** 내 문의 목록(최신 문의 순). 환불 신청도 `REFUND` 문의로 함께 온다. */
export const useMyQnaListQuery = ({ size }: GetMyQnaListParams) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<MyQnaListResponse, AppError>({
    queryKey: qnaQueryKeys.myList(size),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getMyQnaList({ page: pageParam as number, size }),
    getNextPageParam: getNextPageNumber,
    enabled: authReady,
  });
};
