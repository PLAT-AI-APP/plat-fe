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

interface PatchCommentProps extends CommentScope {
  commentId: string;
  /** 최대 1000자 */
  content: string;
}

const patchComment = async ({ commentId, content }: PatchCommentProps) => {
  await authAxios.patch(`/comment/${commentId}`, { content });
};

/**
 * 댓글·답글 수정.
 *
 * 저장을 누르면 수정 모드가 바로 닫히는데, 예전에는 캐시를 고치지 않고 무효화만 해서
 * 목록을 다시 받을 때까지 예전 내용이 보였다. 고친 내용을 먼저 넣고, 실패하면 되돌린다.
 */
export const usePatchCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchCommentProps, CommentCacheSnapshot>({
    mutationKey: ["patch-comment"],
    mutationFn: patchComment,
    onMutate: async ({ commentId, content, ...scope }) => {
      const snapshot = await snapshotCommentCaches(queryClient, scope);

      updateCommentInCaches(queryClient, scope, commentId, (comment) => ({
        ...comment,
        content,
        meta: { ...comment.meta, edited: true },
      }));

      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      restoreCommentCaches(queryClient, snapshot);
    },
  });
};
