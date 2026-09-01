"use client";

import type { ChatRestartDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const ChatRestartDialog = ({ onClose, onConfirm }: ChatRestartDialogProps) => {
  const handleConfirm = () => {
    // 새 채팅방 생성 API 연결 전까지 확인 액션과 닫힘 흐름을 분리
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.chatRestart.cancel"
      confirmText="dialog.chatRestart.confirm"
      label="dialog.chatRestart.title"
      description="dialog.chatRestart.description"
      confirmFn={handleConfirm}
    />
  );
};

export default ChatRestartDialog;
