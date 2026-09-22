import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import {
  type CommentCacheSnapshot,
  type CommentScope,
  restoreCommentCaches,
  snapshotCommentCaches,
  updateCommentInCaches,
} from "./commentCache";

interface CommentLikeProps extends CommentScope {
  commentId: string;
}

const postCommentLike = async ({ commentId }: CommentLikeProps) => {
  await authAxios.post(`/comment/${commentId}/likes`);
};

const deleteCommentLike = async ({ commentId }: CommentLikeProps) => {
  await authAxios.delete(`/comment/${commentId}/likes`);
};

/**
 * 하트는 누른 즉시 바뀌어야 해서 캐시를 먼저 고치고, 실패하면 되돌린다.
 * 좋아요는 멱등이라 성공 뒤에 목록을 다시 받을 필요가 없다 — 예전에는 무한 목록 전체를
 * 무효화해 받아 둔 쪽을 하나씩 다시 받은 뒤에야 하트가 칠해졌다.
 */
const useCommentLikeMutation = (
  mutationKey: string,
  mutationFn: (props: CommentLikeProps) => Promise<void>,
  liked: boolean,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, CommentLikeProps, CommentCacheSnapshot>({
    mutationKey: [mutationKey],
    mutationFn,
    onMutate: async ({ commentId, ...scope }) => {
      const snapshot = await snapshotCommentCaches(queryClient, scope);

      updateCommentInCaches(queryClient, scope, commentId, (comment) =>
        comment.meta.liked === liked
          ? comment
          : {
              ...comment,
              meta: {
                ...comment.meta,
                liked,
                likeCount: Math.max(comment.meta.likeCount + (liked ? 1 : -1), 0),
              },
            },
      );

      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      restoreCommentCaches(queryClient, snapshot);
    },
  });
};

/** 댓글 좋아요 */
export const usePostCommentLikeMutation = () =>
  useCommentLikeMutation("post-comment-like", postCommentLike, true);

/** 댓글 좋아요 취소 */
export const useDeleteCommentLikeMutation = () =>
  useCommentLikeMutation("delete-comment-like", deleteCommentLike, false);
