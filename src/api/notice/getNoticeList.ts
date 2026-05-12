import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError, PageResponse } from "@/type/api";

export interface NoticeListResponseData {
  noticeId: number;
  type: "NOTICE" | "UPDATE" | "EVENT";
  title: string;
  createdAt: string;
  isPinned: boolean;
}

export interface GetNoticeListParams {
  size?: number;
  type?: "NOTICE" | "UPDATE" | "EVENT" | null;
}

// API 요청 함수
const getNoticeList = async (
  params: GetNoticeListParams,
  pageParam: number,
) => {
  const response = await axiosInstance.get<
    ApiSuccessResponse<PageResponse<NoticeListResponseData>>
  >(
    `/notice`, // 앞서 정의한 공지사항 엔드포인트 규격 반영
    {
      params: {
        page: pageParam,
        size: params.size ?? 20,
        ...(params.type && { type: params.type }), // type이 있을 때만 쿼리 스트링에 포함
      },
    },
  );

  return response.data.data;
};

/** 공지사항 목록 조회 */
export const useNoticeListInfiniteQuery = (
  params: GetNoticeListParams = {},
) => {
  return useInfiniteQuery<PageResponse<NoticeListResponseData>, AppError>({
    queryKey: ["get-notice-list", params.type],
    queryFn: ({ pageParam }) => getNoticeList(params, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? null : lastPage.number + 1;
    },

    staleTime: 1000 * 60 * 5,
  });
};
