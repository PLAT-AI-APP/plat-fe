"use client";

import { useIsMutating } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DELETE_USER_MUTATION_KEY } from "@/api/user/deleteUser";
import type { WithdrawalConfirmDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WithdrawalConfirmDialog = ({
  onClose,
  onConfirm,
}: WithdrawalConfirmDialogProps) => {
  const t = useTranslations();
  // Dialog는 열릴 때 props가 고정되므로 진행 상태는 뮤테이션에서 직접 구독합니다.
  const isPending =
    useIsMutating({ mutationKey: DELETE_USER_MUTATION_KEY }) > 0;

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.withdrawalConfirm.cancel"
      confirmText={
        isPending
          ? t("dialog.withdrawalConfirm.confirmPending")
          : t("dialog.withdrawalConfirm.confirm")
      }
      label="dialog.withdrawalConfirm.title"
      description={`${t("dialog.withdrawalConfirm.descriptionLine1")}\n${t("dialog.withdrawalConfirm.descriptionLine2")}`}
      confirmFn={onConfirm}
    />
  );
};

export default WithdrawalConfirmDialog;
