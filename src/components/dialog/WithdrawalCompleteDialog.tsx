"use client";

import { useTranslations } from "next-intl";
import type { WithdrawalCompleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WithdrawalCompleteDialog = ({
  onClose,
  onConfirm,
}: WithdrawalCompleteDialogProps) => {
  const t = useTranslations();

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <Dialog
      onClose={handleConfirm}
      label="dialog.withdrawalComplete.title"
      description={`${t("dialog.withdrawalComplete.descriptionLine1")}\n${t("dialog.withdrawalComplete.descriptionLine2")}`}
      confirmText="dialog.withdrawalComplete.confirm"
      confirmFn={handleConfirm}
    />
  );
};

export default WithdrawalCompleteDialog;
