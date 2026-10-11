"use client";

import { useIsMutating } from "@tanstack/react-query";
import { CANCEL_QNA_MUTATION_KEY } from "@/api/qna/postQnaCancel";
import type { QnaCancelDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const QnaCancelDialog = ({ onClose, onConfirm }: QnaCancelDialogProps) => {
  // Dialog는 열릴 때 props가 고정되므로 진행 상태는 뮤테이션에서 직접 구독합니다.
  const isPending = useIsMutating({ mutationKey: CANCEL_QNA_MUTATION_KEY }) > 0;

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.qnaCancel.cancel"
      confirmText="dialog.qnaCancel.confirm"
      label="dialog.qnaCancel.title"
      description="dialog.qnaCancel.description"
      confirmFn={onConfirm}
      isConfirmPending={isPending}
    />
  );
};

export default QnaCancelDialog;
