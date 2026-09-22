"use client";

import type { CommentDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const CommentDeleteDialog = ({
  isReply = false,
  onClose,
  onConfirm,
}: CommentDeleteDialogProps) => {
  // 댓글을 지우면 대댓글도 함께 지워지므로 그 안내는 댓글에만 맞다. 답글은 별도 문구를 쓴다.
  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      label={
        isReply
          ? "dialog.commentDelete.replyTitle"
          : "dialog.commentDelete.title"
      }
      description={
        isReply
          ? "dialog.commentDelete.replyDescription"
          : "dialog.commentDelete.description"
      }
      confirmFn={onConfirm}
    />
  );
};

export default CommentDeleteDialog;
