import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostHashtagSuggestProps {
  name: string;
  opinion: string;
}
const postHashtagSuggest = async (params: PostHashtagSuggestProps) => {
  const response = await authAxios.post<ApiSuccessResponse>(
    `/hashtag/suggest`,
    {
      params,
    },
  );
  alert(response.data.message);
  return response.data;
};

/** 해시태그 제안하기 */
export const useHashtagSuggestMutation = () => {
  return useMutation<ApiSuccessResponse, AppError, PostHashtagSuggestProps>({
    mutationKey: ["post-hashtag-suggest"],
    mutationFn: postHashtagSuggest,
  });
};
