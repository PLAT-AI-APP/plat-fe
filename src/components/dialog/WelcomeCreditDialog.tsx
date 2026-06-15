"use client";

import { useTranslations } from "next-intl";
import type { WelcomeCreditDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WelcomeCreditDialog = ({
  onClose,
  onConfirm,
}: WelcomeCreditDialogProps) => {
  const t = useTranslations();

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog
      onClose={handleConfirm}
      label="dialog.welcomeCredit.title"
      description={
        <div className="body-4 w-full text-font-2">
          <p>
            {t("dialog.welcomeCredit.descriptionBefore")}
            <span className="title-5 text-font-1">
              {t("dialog.welcomeCredit.descriptionHighlight")}
            </span>
          </p>
          <p>{t("dialog.welcomeCredit.descriptionAfter")}</p>
        </div>
      }
      confirmText="dialog.welcomeCredit.confirm"
      confirmFn={handleConfirm}
    />
  );
};

export default WelcomeCreditDialog;
