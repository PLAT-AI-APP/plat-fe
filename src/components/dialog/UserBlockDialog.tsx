"use client";

import { useTranslations } from "next-intl";
import type { UserBlockDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const UserBlockDialog = ({
  nickname,
  onClose,
  onConfirm,
}: UserBlockDialogProps) => {
  const t = useTranslations();

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.userBlock.cancel"
      confirmText="dialog.userBlock.confirm"
      label={t("dialog.userBlock.title", { nickname })}
      description="dialog.userBlock.description"
      confirmFn={onConfirm}
    />
  );
};

export default UserBlockDialog;
