"use client";

import { useState } from "react";
import { useDeleteCommentMutation } from "@/api/comment/deleteComment";
import { useDeleteCommentPinMutation } from "@/api/comment/deleteCommentPin";
import { usePatchCommentMutation } from "@/api/comment/patchComment";
import { usePatchCommentPinMutation } from "@/api/comment/patchCommentPin";
import {
  useDeleteCommentLikeMutation,
  usePostCommentLikeMutation,
} from "@/api/comment/postCommentLike";
import { useRequireLogin } from "@/hooks/common/useRequireLogin";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import type { Comment } from "@/type/comment";

interface UseCommentActionsOptions {
  comment: Comment;
  universeId: string;
  /** 답글이면 부모 댓글 id. 변경 후 어느 목록 캐시를 고칠지 정하는 데 쓴다. */
  parentCommentId?: string;
}

/**
 * 댓글 한 줄에서 할 수 있는 동작(좋아요·수정·삭제·신고·고정)과 수정 상태.
 *
 * 댓글과 답글이 같은 동작을 쓰므로 컴포넌트에서 떼어 둔다. 답글 등록·답글 목록은
 * 최상위 댓글에만 있는 기능이라 CommentReplyThread 가 따로 맡는다.
 */
export const useCommentActions = ({
  comment,
  universeId,
  parentCommentId,
}: UseCommentActionsOptions) => {
  const requireLogin = useRequireLogin();
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const openModal = useModalStore((state) => state.openModal);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { mutate: like } = usePostCommentLikeMutation();
  const { mutate: unlike } = useDeleteCommentLikeMutation();
  const { mutate: patchComment, isPending: isPatching } =
    usePatchCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();
  const { mutate: pinComment } = usePatchCommentPinMutation();
  const { mutate: unpinComment } = useDeleteCommentPinMutation();

  const scope = { universeId, parentCommentId };

  const toggleLike = () => {
    // 조용히 막으면 눌러도 아무 일이 없어 보이므로 로그인 창을 바로 연다.
    if (!requireLogin()) return;

    const variables = { commentId: comment.commentId, ...scope };
    if (comment.meta.liked) unlike(variables);
    else like(variables);
  };

  const startEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  const submitEdit = () => {
    const content = editedContent.trim();
    if (!content || isPatching) return;

    patchComment(
      { commentId: comment.commentId, content, ...scope },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const remove = () => {
    openDialog("COMMENT_DELETE", {
      isReply: Boolean(parentCommentId),
      onConfirm: () => {
        deleteComment(
          { commentId: comment.commentId, ...scope },
          { onSettled: closeDialog },
        );
      },
    });
  };

  // 비로그인이면 모달 스토어가 신고 대신 로그인 창을 연다.
  const report = () => {
    openModal("REPORT", {
      targetType: "COMMENT",
      targetId: comment.commentId,
      targetName: comment.author.nickname,
    });
  };

  const pin = () => {
    pinComment({ universeId, commentId: comment.commentId });
  };

  const unpin = () => {
    unpinComment({ universeId });
  };

  return {
    toggleLike,
    edit: {
      isEditing,
      content: editedContent,
      setContent: setEditedContent,
      canSubmit: !isPatching && Boolean(editedContent.trim()),
      start: startEdit,
      cancel: cancelEdit,
      submit: submitEdit,
    },
    remove,
    report,
    pin,
    unpin,
  };
};
