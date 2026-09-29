"use client";

import type { ChatTurnDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

/** 한 턴 삭제 확인. 되돌릴 수 없고, 쓴 노트도 돌아오지 않는다는 것을 먼저 알린다. */
const ChatTurnDeleteDialog = ({
  onClose,
  onConfirm,
}: ChatTurnDeleteDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.chatTurnDelete.cancel"
      confirmText="dialog.chatTurnDelete.confirm"
      label="dialog.chatTurnDelete.title"
      description="dialog.chatTurnDelete.description"
      confirmFn={handleConfirm}
    />
  );
};

export default ChatTurnDeleteDialog;
