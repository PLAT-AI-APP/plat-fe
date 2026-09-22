import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import {
  type CommentCacheSnapshot,
  type CommentScope,
  removeCommentFromCaches,
  restoreCommentCaches,
  snapshotCommentCaches,
} from "./commentCache";
import { commentQueryKeys } from "./queryKeys";

interface DeleteCommentProps extends CommentScope {
  commentId: string;
}

const deleteComment = async ({ commentId }: DeleteCommentProps) => {
  await authAxios.delete(`/comment/${commentId}`);
};

/**
 * 댓글·답글 삭제.
 *
 * 확인 창이 닫히는 순간 목록에서도 빠져야 한다. 예전에는 목록을 다시 받을 때까지 지운 댓글이
 * 남아 있었다. 먼저 빼고, 실패하면 되돌린다.
 *
 * 성공 뒤에는 목록을 뒤에서 다시 맞춘다. 쪽 번호로 나눠 받는 목록이라 하나가 빠지면 다음 쪽의
 * 경계가 한 칸씩 당겨져, 그대로 두면 다음 쪽을 받을 때 댓글 하나를 건너뛴다.
 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, DeleteCommentProps, CommentCacheSnapshot>({
    mutationKey: ["delete-comment"],
    mutationFn: deleteComment,
    onMutate: async ({ commentId, ...scope }) => {
      const snapshot = await snapshotCommentCaches(queryClient, scope);
      removeCommentFromCaches(queryClient, scope, commentId);
      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      restoreCommentCaches(queryClient, snapshot);
    },
    onSuccess: (_, { commentId, universeId, parentCommentId }) => {
      queryClient.removeQueries({
        queryKey: commentQueryKeys.replies(commentId),
      });
      if (universeId) {
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.universeComments(universeId),
        });
      }
      if (parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.replies(parentCommentId),
        });
      }
    },
  });
};
