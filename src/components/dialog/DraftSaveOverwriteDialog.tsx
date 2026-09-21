"use client";

import { useTranslations } from "next-intl";
import type { DraftSaveOverwriteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const DraftSaveOverwriteDialog = ({
  onCancel,
  onClose,
  onConfirm,
}: DraftSaveOverwriteDialogProps) => {
  const t = useTranslations();

  const handleCancel = () => {
    onClose();
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog
      onClose={handleCancel}
      cancelFn={handleCancel}
      label={
        <p className="body-3 text-center text-font-1">
          {t("dialog.draftSaveOverwrite.titleBefore")}
          <span className="text-brand">
            {t("dialog.draftSaveOverwrite.titleHighlight")}
          </span>
          {t("dialog.draftSaveOverwrite.titleAfter")}
        </p>
      }
      description="dialog.draftSaveOverwrite.description"
      confirmFn={handleConfirm}
    />
  );
};

export default DraftSaveOverwriteDialog;
