"use client";

import type { ChatLeaveDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const ChatLeaveDialog = ({ onClose, onConfirm }: ChatLeaveDialogProps) => {
  const handleConfirm = () => {
    // 나가기 처리 후 다이얼로그 닫기 흐름
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.chatLeave.cancel"
      confirmText="dialog.chatLeave.confirm"
      label="dialog.chatLeave.title"
      description="dialog.chatLeave.description"
      confirmFn={handleConfirm}
    />
  );
};

export default ChatLeaveDialog;
