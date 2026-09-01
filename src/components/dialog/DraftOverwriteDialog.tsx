"use client";

import { useTranslations } from "next-intl";
import type { DraftOverwriteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const DraftOverwriteDialog = ({
  onCancel,
  onClose,
  onConfirm,
}: DraftOverwriteDialogProps) => {
  const t = useTranslations();

  const handleCancel = () => {
    onClose();
    onCancel();
  };

  return (
    <Dialog
      onClose={handleCancel}
      cancelFn={handleCancel}
      label={
        <p className="body-2 text-center text-font-1">
          {t("dialog.draftOverwrite.titleBefore")}
          <span className="text-brand">
            {t("dialog.draftOverwrite.titleHighlight")}
          </span>
          {t("dialog.draftOverwrite.titleAfter")}
        </p>
      }
      description="dialog.draftOverwrite.description"
      confirmFn={onConfirm}
    />
  );
};

export default DraftOverwriteDialog;
