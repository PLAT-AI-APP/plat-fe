import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { commentRepliesQueryKey } from "./getCommentReplies";
import { universeCommentsQueryKey } from "./getUniverseComments";

interface CommentLikeProps {
  commentId: string;
  /** 갱신할 목록을 특정하기 위해 함께 받습니다. */
  universeId?: string;
  /** 답글이면 부모 댓글 id */
  parentCommentId?: string;
}

const postCommentLike = async ({ commentId }: CommentLikeProps) => {
  await authAxios.post(`/comment/${commentId}/likes`);
};

const deleteCommentLike = async ({ commentId }: CommentLikeProps) => {
  await authAxios.delete(`/comment/${commentId}/likes`);
};

const invalidateCommentLists = (
  queryClient: ReturnType<typeof useQueryClient>,
  { universeId, parentCommentId }: CommentLikeProps,
) => {
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
};

/** 댓글 좋아요 */
export const usePostCommentLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, CommentLikeProps>({
    mutationKey: ["post-comment-like"],
    mutationFn: postCommentLike,
    onSuccess: (_, variables) =>
      invalidateCommentLists(queryClient, variables),
  });
};

/** 댓글 좋아요 취소 */
export const useDeleteCommentLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, CommentLikeProps>({
    mutationKey: ["delete-comment-like"],
    mutationFn: deleteCommentLike,
    onSuccess: (_, variables) =>
      invalidateCommentLists(queryClient, variables),
  });
};
