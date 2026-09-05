import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import type { NoticeCategory } from "./getNoticeList";

export interface NoticeDetailResponseData {
  noticeId: string;
  category: NoticeCategory;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetNoticeDetailContentsProps {
  noticeId: string;
}

// API 요청 함수
const getNoticeDetailContents = async ({
  noticeId,
}: GetNoticeDetailContentsProps) => {
  const response = await axiosInstance.get<NoticeDetailResponseData>(
    `/notices/${noticeId}`,
  );

  return response.data;
};

/** 공지사항 상세내용 조회 */
export const useNoticeDetailContentsQuery = ({
  noticeId,
}: GetNoticeDetailContentsProps) => {
  return useQuery<NoticeDetailResponseData, AppError>({
    queryKey: ["get-notice-detail-contents", noticeId],
    queryFn: () => getNoticeDetailContents({ noticeId }),
    staleTime: 1000 * 60 * 5,
  });
};
