import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { commentRepliesQueryKey } from "./getCommentReplies";
import { universeCommentsQueryKey } from "./getUniverseComments";

interface PatchCommentProps {
  commentId: string;
  /** 최대 1000자 */
  content: string;
  universeId?: string;
  /** 답글이면 부모 댓글 id */
  parentCommentId?: string;
}

const patchComment = async ({ commentId, content }: PatchCommentProps) => {
  await authAxios.patch(`/comment/${commentId}`, { content });
};

/** 댓글·답글 수정 */
export const usePatchCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchCommentProps>({
    mutationKey: ["patch-comment"],
    mutationFn: patchComment,
    onSuccess: (_, { universeId, parentCommentId }) => {
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
