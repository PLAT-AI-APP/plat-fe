import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

/** 백엔드 FeedbackType 중 신고 사유로 쓰이는 값들. */
export type FeedbackReportType = "USER" | "CHARACTER" | "MESSAGE" | "COMMENT";

export interface PostFeedbackReportPayload {
  type: FeedbackReportType;
  /** 신고 대상 ID. COMMENT면 commentId. */
  targetId: string;
  title: string;
  content: string;
}

const postFeedbackReport = async (payload: PostFeedbackReportPayload) => {
  await authAxios.post("/feedback/report", payload);
};

/** 신고 등록 */
export const useFeedbackReportMutation = () => {
  return useMutation<void, AppError, PostFeedbackReportPayload>({
    mutationKey: ["post-feedback-report"],
    mutationFn: postFeedbackReport,
  });
};
