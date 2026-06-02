"use client";

import Dialog from "@/components/Dialog";
import { useModalStore } from "@/store/useModalStore";
import { NoticeDialogModalProps } from "@/type/modal";

const NoticeDialogModal = ({
  onClose,
  label,
  description,
  confirmText = "확인",
}: NoticeDialogModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleConfirm = () => {
    onClose();
    openModal("LOGIN", { triggerRef: undefined });
  };

  return (
    <Dialog
      onClose={onClose}
      label={label}
      description={description}
      confirmText={confirmText}
      confirmFn={handleConfirm}
    />
  );
};

export default NoticeDialogModal;
