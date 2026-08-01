import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";

export interface NoticeListResponseData {
  noticeId: string;
  type: "NOTICE" | "EVENT" | "UPDATE";
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNoticeDetailContentsProps {
  noticeId: string;
}

// API 요청 함수
const getNoticeDetailContents = async ({
  noticeId,
}: GetNoticeDetailContentsProps) => {
  const response = await axiosInstance.get<NoticeListResponseData>(
    `/notice/${noticeId}`,
  );

  return response.data;
};

/** 공지사항 상세내용 조회 */
export const useNoticeDetailContentsQuery = ({
  noticeId,
}: GetNoticeDetailContentsProps) => {
  return useQuery<NoticeListResponseData, AppError>({
    queryKey: ["get-notice-detail-contents", noticeId],
    queryFn: () => getNoticeDetailContents({ noticeId }),
    staleTime: 1000 * 60 * 5,
  });
};
