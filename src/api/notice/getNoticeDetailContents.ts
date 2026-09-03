import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import type { NoticeDetail } from "@/type/notice";

export interface GetNoticeDetailContentsProps {
  noticeId: string;
}

const getNoticeDetailContents = async ({
  noticeId,
}: GetNoticeDetailContentsProps) => {
  const response = await axiosInstance.get<NoticeDetail>(
    `/notices/${noticeId}`,
  );

  return response.data;
};

/** 공지사항 상세내용 조회 */
export const useNoticeDetailContentsQuery = ({
  noticeId,
}: GetNoticeDetailContentsProps) => {
  return useQuery<NoticeDetail, AppError>({
    queryKey: ["get-notice-detail-contents", noticeId],
    queryFn: () => getNoticeDetailContents({ noticeId }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(noticeId),
  });
};
