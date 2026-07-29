import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostHashtagSuggestProps {
  name: string;
  opinion: string;
}

const postHashtagSuggest = async (params: PostHashtagSuggestProps) => {
  await authAxios.post<ApiSuccessResponse>(`/hashtag/suggest`, {
    params,
  });
};

/** 해시태그 제안 */
export const useHashtagSuggestMutation = () => {
  return useMutation<void, AppError, PostHashtagSuggestProps>({
    mutationKey: ["post-hashtag-suggest"],
    mutationFn: postHashtagSuggest,
  });
};
