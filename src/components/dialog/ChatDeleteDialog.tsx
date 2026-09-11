"use client";

import type { ChatDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const ChatDeleteDialog = ({ onClose, onConfirm }: ChatDeleteDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.chatDelete.cancel"
      confirmText="dialog.chatDelete.confirm"
      label="dialog.chatDelete.title"
      description="dialog.chatDelete.description"
      confirmFn={handleConfirm}
    />
  );
};

export default ChatDeleteDialog;
