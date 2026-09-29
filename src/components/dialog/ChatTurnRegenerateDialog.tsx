"use client";

import type { ChatTurnRegenerateDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

/** 중간 답 다시 만들기 확인. 새 답이 확정되면 그 뒤 대화가 지워진다는 것을 먼저 알린다. */
const ChatTurnRegenerateDialog = ({
  onClose,
  onConfirm,
}: ChatTurnRegenerateDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.chatTurnRegenerate.cancel"
      confirmText="dialog.chatTurnRegenerate.confirm"
      label="dialog.chatTurnRegenerate.title"
      description="dialog.chatTurnRegenerate.description"
      confirmFn={handleConfirm}
    />
  );
};

export default ChatTurnRegenerateDialog;
