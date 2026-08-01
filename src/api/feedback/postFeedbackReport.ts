import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export type FeedbackReportType = "HASHTAG";

export interface PostFeedbackReportPayload {
  type: FeedbackReportType;
  targetId: string;
  title: string;
  content: string;
}

const postFeedbackReport = async (payload: PostFeedbackReportPayload) => {
  await authAxios.post("/feedback/report", payload);
};

/** 피드백 등록 */
export const useFeedbackReportMutation = () => {
  return useMutation<void, AppError, PostFeedbackReportPayload>({
    mutationKey: ["post-feedback-report"],
    mutationFn: postFeedbackReport,
  });
};
