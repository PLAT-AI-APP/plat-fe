import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";

export type NoticeCategory =
  "SERVICE" | "UPDATE" | "EVENT" | "MAINTENANCE" | "POLICY";

export interface NoticeListResponseData {
  noticeId: string;
  category: NoticeCategory;
  title: string;
  createdAt: string;
  isPinned: boolean;
}

/** 백엔드 PageWith<NoticeSummaryResponse> 응답 구조 */
export interface NoticeListPageResponse {
  page: {
    number: number;
    size: number;
    numberOfElements: number;
    hasNext: boolean;
    totalElements: number;
    totalPages: number;
  };
  content: NoticeListResponseData[];
}

// API 요청 함수
// 실서버 GET /notices는 page만 받고, 페이지 크기(20)와 카테고리 필터는 서버에서 지원하지 않습니다.
const getNoticeList = async (pageParam: number) => {
  const response = await axiosInstance.get<NoticeListPageResponse>(
    `/notices`,
    {
      params: {
        page: pageParam,
      },
    },
  );

  return response.data;
};

/** 공지사항 목록 조회 */
export const useNoticeListInfiniteQuery = () => {
  return useInfiniteQuery<NoticeListPageResponse, AppError>({
    queryKey: ["get-notice-list"],
    queryFn: ({ pageParam }) => getNoticeList(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60 * 5,
  });
};
