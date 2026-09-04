import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export type FeedbackSuggestType = "HASHTAG";

export interface PostFeedbackSuggestPayload {
  type: FeedbackSuggestType;
  title: string;
  content: string;
}

const postFeedbackSuggest = async (payload: PostFeedbackSuggestPayload) => {
  await authAxios.post("/feedback/suggest", payload);
};

/** 건의사항 등록 */
export const useFeedbackSuggestMutation = () => {
  return useMutation<void, AppError, PostFeedbackSuggestPayload>({
    mutationKey: ["post-feedback-suggest"],
    mutationFn: postFeedbackSuggest,
  });
};
