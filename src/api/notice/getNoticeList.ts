import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import type { NoticeSummary } from "@/type/notice";

// 실서버 GET /notices는 page만 받고, 페이지 크기와 카테고리 필터는 서버에서 지원하지 않습니다.
const getNoticeList = async (pageParam: number) => {
  const response = await axiosInstance.get<PageWith<NoticeSummary>>(
    "/notices",
    {
      params: {
        page: pageParam,
      },
    },
  );

  return response.data;
};

/** 공지사항 목록 조회. 고정 공지가 먼저 오고 그 안에서는 최신순입니다. */
export const useNoticeListInfiniteQuery = () => {
  return useInfiniteQuery<PageWith<NoticeSummary>, AppError>({
    queryKey: ["get-notice-list"],
    queryFn: ({ pageParam }) => getNoticeList(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60 * 5,
  });
};
