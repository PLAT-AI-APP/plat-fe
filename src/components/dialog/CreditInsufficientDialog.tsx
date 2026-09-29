"use client";

import { useRouter } from "next/navigation";
import type { CreditInsufficientDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

/** 노트가 모자라 채팅을 시작하지 못했을 때. 보낸 말은 입력창에 돌아가 있으니 충전하고 다시 보내면 된다. */
const CreditInsufficientDialog = ({ onClose }: CreditInsufficientDialogProps) => {
  const router = useRouter();

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.creditInsufficient.cancel"
      confirmText="dialog.creditInsufficient.confirm"
      label="dialog.creditInsufficient.title"
      description="dialog.creditInsufficient.description"
      confirmFn={() => {
        onClose();
        router.push("/token-charge");
      }}
    />
  );
};

export default CreditInsufficientDialog;
