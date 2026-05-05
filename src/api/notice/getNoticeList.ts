import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

// 1. 공지사항 개별 아이템 타입 정의
export interface NoticeItem {
  noticeId: number;
  type: "NOTICE" | "UPDATE" | "EVENT";
  title: string;
  createdAt: string;
  isPinned: boolean;
}

// 2. 서버에서 내려주는 공지사항 목록 응답 데이터 규격
export interface NoticeListResponseData {
  content: NoticeItem[];
  page: number;
  size: number;
  totalElements: number;
  last: boolean;
}

// 3. API 요청 함수 파라미터 타입 (필터링용 type 추가)
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
    ApiSuccessResponse<NoticeListResponseData>
  >(
    `/notice`, // 앞서 정의한 공지사항 엔드포인트 규격 반영
    {
      params: {
        page: pageParam, // useInfiniteQuery가 넘겨주는 pageParam 바인딩
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
  return useInfiniteQuery<NoticeListResponseData, AppError>({
    queryKey: ["get-notice-list", params.type],
    queryFn: ({ pageParam }) => getNoticeList(params, pageParam as number),

    // 무한 스크롤의 시작 페이지 번호 (명세서 기준 0-based)
    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      // 서버에서 마지막 페이지(last: true)라고 알려주면 undefined를 반환하여 조회를 멈춤
      if (lastPage.last) return undefined;

      // 마지막 페이지가 아니라면 다음 페이지 번호 반환
      return lastPage.page + 1;
    },

    staleTime: 1000 * 60 * 5,
  });
};
