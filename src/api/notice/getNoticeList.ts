import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import type { NoticeCategory, NoticeSummary } from "@/type/notice";

export interface GetNoticeListParams {
  size?: number;
  /** 분류를 비우면 전체 목록입니다. 서버가 걸러 주므로 필요한 분류만 받아옵니다. */
  category?: NoticeCategory | null;
}

const getNoticeList = async (params: GetNoticeListParams, page: number) => {
  const response = await axiosInstance.get<PageWith<NoticeSummary>>(
    "/notices",
    {
      params: {
        page,
        size: params.size ?? 20,
        // 값이 없으면 아예 실어 보내지 않습니다 — 서버는 빠진 것을 "조건 없음"으로 읽습니다.
        ...(params.category ? { category: params.category } : {}),
      },
    },
  );

  return response.data;
};

/** 공지사항 목록 조회. 고정 공지가 먼저 오고 그 안에서는 최신순입니다. */
export const useNoticeListInfiniteQuery = (
  params: GetNoticeListParams = {},
) => {
  return useInfiniteQuery<PageWith<NoticeSummary>, AppError>({
    // 분류가 바뀌면 다른 목록이므로 캐시를 나눕니다.
    queryKey: ["get-notice-list", params.category ?? "ALL", params.size],
    queryFn: ({ pageParam }) => getNoticeList(params, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60 * 5,
  });
};
