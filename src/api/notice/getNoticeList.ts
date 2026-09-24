import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import type { NoticeCategory, NoticeSummary } from "@/type/notice";
import { getNextPageNumber } from "@/lib/pagination";
import { noticeQueryKeys } from "./queryKeys";

// 실서버 GET /notices 는 page(크기는 서버가 20으로 고정)와 선택적 category 를 받습니다.
const getNoticeList = async (
  pageParam: number,
  category?: NoticeCategory | null,
) => {
  const response = await axiosInstance.get<PageWith<NoticeSummary>>(
    "/notices",
    {
      params: {
        page: pageParam,
        // 전체 탭은 category 를 보내지 않는다.
        ...(category && { category }),
      },
    },
  );

  return response.data;
};

/**
 * 공지사항 목록 조회. 고정 공지가 먼저 오고 그 안에서는 최신순입니다.
 *
 * category 를 주면 서버가 그 분류만 내려줍니다. 탭을 바꾸면 조회 키가 달라져 그 탭의 목록을
 * 새로 요청하고, 한 번 본 탭은 캐시에서 바로 보여줍니다.
 *
 * 처음 여는 탭은 새 목록이 올 때까지 앞 탭의 목록을 흐리게 둔다(keepPreviousData). 목록 전체를
 * 스켈레톤으로 바꾸면 필터를 누를 때마다 화면이 번쩍였다.
 */
export const useNoticeListInfiniteQuery = (
  category?: NoticeCategory | null,
) => {
  return useInfiniteQuery<PageWith<NoticeSummary>, AppError>({
    queryKey: noticeQueryKeys.list(category),
    queryFn: ({ pageParam }) => getNoticeList(pageParam as number, category),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
