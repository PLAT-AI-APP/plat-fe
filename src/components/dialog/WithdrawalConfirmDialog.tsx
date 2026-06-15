"use client";

import { useTranslations } from "next-intl";
import type { WithdrawalConfirmDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WithdrawalConfirmDialog = ({
  isPending,
  onClose,
  onConfirm,
}: WithdrawalConfirmDialogProps) => {
  const t = useTranslations();

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
