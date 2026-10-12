"use client";

import { useRef } from "react";
import type { AdultReleaseConfirmDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

/**
 * 성인 세계관을 일반으로 바꿔 저장하기 전에 한 번 더 묻는다.
 * 해제하면 검수 대기로 돌아가 관리자 승인 전까지 일반 목록에 보이지 않는다.
 */
const AdultReleaseConfirmDialog = ({
  onClose,
  onConfirm,
  onCancel,
}: AdultReleaseConfirmDialogProps) => {
  // 확인한 뒤 창이 닫히는 것을 취소로 세지 않는다.
  const isConfirmedRef = useRef(false);

  const handleConfirm = () => {
    isConfirmedRef.current = true;
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    if (!isConfirmedRef.current) onCancel?.();
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      cancelFn={handleClose}
      cancelText="dialog.adultReleaseConfirm.cancel"
      confirmText="dialog.adultReleaseConfirm.confirm"
      label="dialog.adultReleaseConfirm.title"
      description="dialog.adultReleaseConfirm.description"
      confirmFn={handleConfirm}
    />
  );
};

export default AdultReleaseConfirmDialog;
