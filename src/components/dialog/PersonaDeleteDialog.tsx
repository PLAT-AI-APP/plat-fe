"use client";

import { useTranslations } from "next-intl";
import type { PersonaDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const PersonaDeleteDialog = ({
  personaName,
  onClose,
  onConfirm,
}: PersonaDeleteDialogProps) => {
  const t = useTranslations();

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.personaDelete.cancel"
      confirmText="dialog.personaDelete.confirm"
      label="dialog.personaDelete.title"
      description={t("dialog.personaDelete.description", { personaName })}
      confirmFn={onConfirm}
    />
  );
};

export default PersonaDeleteDialog;
