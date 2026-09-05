import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { commentRepliesQueryKey } from "./getCommentReplies";
import { universeCommentsQueryKey } from "./getUniverseComments";

interface DeleteCommentProps {
  commentId: string;
  universeId?: string;
  /** 답글이면 부모 댓글 id */
  parentCommentId?: string;
}

const deleteComment = async ({ commentId }: DeleteCommentProps) => {
  await authAxios.delete(`/comment/${commentId}`);
};

/** 댓글·답글 삭제 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, DeleteCommentProps>({
    mutationKey: ["delete-comment"],
    mutationFn: deleteComment,
    onSuccess: (_, { commentId, universeId, parentCommentId }) => {
      queryClient.removeQueries({
        queryKey: commentRepliesQueryKey(commentId),
      });
      if (universeId) {
        queryClient.invalidateQueries({
          queryKey: universeCommentsQueryKey(universeId),
        });
      }
      if (parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: commentRepliesQueryKey(parentCommentId),
        });
      }
    },
  });
};
