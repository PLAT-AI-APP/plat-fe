"use client";

import type { CommentDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const CommentDeleteDialog = ({
  onClose,
  onConfirm,
}: CommentDeleteDialogProps) => {
  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.commentDelete.cancel"
      confirmText="dialog.commentDelete.confirm"
      label="dialog.commentDelete.title"
      description="dialog.commentDelete.description"
      confirmFn={onConfirm}
    />
  );
};

export default CommentDeleteDialog;
