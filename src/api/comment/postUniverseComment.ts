import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { universeCommentsQueryKey } from "./getUniverseComments";

interface PostUniverseCommentProps {
  universeId: string;
  /** 최대 1000자. 공백만으로는 보낼 수 없습니다. */
  content: string;
}

const postUniverseComment = async ({
  universeId,
  content,
}: PostUniverseCommentProps) => {
  await authAxios.post(`/comment/universe/${universeId}`, { content });
};

/** 세계관 댓글 작성 */
export const usePostUniverseCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PostUniverseCommentProps>({
    mutationKey: ["post-universe-comment"],
    mutationFn: postUniverseComment,
    onSuccess: (_, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: universeCommentsQueryKey(universeId),
      });
    },
  });
};
