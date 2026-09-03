import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import type { NoticeCategory, NoticeSummary } from "@/type/notice";

export interface GetNoticeListParams {
  size?: number;
  /** 서버는 분류 필터를 받지 않아 받아온 목록에서 걸러냅니다. */
  category?: NoticeCategory | null;
}

const getNoticeList = async (params: GetNoticeListParams, page: number) => {
  const response = await axiosInstance.get<PageWith<NoticeSummary>>(
    "/notices",
    {
      params: {
        page,
        size: params.size ?? 20,
      },
    },
  );

  return response.data;
};

/** 공지사항 목록 조회 */
export const useNoticeListInfiniteQuery = (
  params: GetNoticeListParams = {},
) => {
  return useInfiniteQuery<PageWith<NoticeSummary>, AppError>({
    queryKey: ["get-notice-list", params.size],
    queryFn: ({ pageParam }) => getNoticeList(params, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60 * 5,
  });
};
