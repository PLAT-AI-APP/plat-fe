import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { commentQueryKeys } from "./queryKeys";

interface PostCommentReplyProps {
  commentId: string;
  /** 최대 1000자 */
  content: string;
  /** 부모 댓글의 답글 수를 갱신하기 위해 함께 받습니다. */
  universeId?: string;
}

const postCommentReply = async ({
  commentId,
  content,
}: PostCommentReplyProps) => {
  await authAxios.post(`/comment/${commentId}/replies`, { content });
};

/** 답글 작성 */
export const usePostCommentReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PostCommentReplyProps>({
    mutationKey: ["post-comment-reply"],
    mutationFn: postCommentReply,
    onSuccess: (_, { commentId, universeId }) => {
      // 입력창을 닫기 전에 새 답글과 부모의 답글 수가 함께 반영되도록 두 재조회를 기다립니다.
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.replies(commentId),
        }),
        ...(universeId
          ? [
              queryClient.invalidateQueries({
                queryKey: commentQueryKeys.universeComments(universeId),
              }),
            ]
          : []),
      ]);
    },
  });
};
