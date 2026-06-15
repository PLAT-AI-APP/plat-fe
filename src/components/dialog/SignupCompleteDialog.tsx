"use client";

import { useTranslations } from "next-intl";
import type { SignupCompleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const SignupCompleteDialog = ({
  nickname,
  onClose,
  onLogin,
}: SignupCompleteDialogProps) => {
  const t = useTranslations();

  const handleLogin = () => {
    onClose();
    onLogin();
  };

  return (
    <Dialog
      onClose={onClose}
      label={
        <div className="flex w-full flex-col items-start justify-end gap-3 break-words">
          <div className="flex w-full flex-col items-start gap-1">
            <p className="body-5 w-full text-font-2">
              {t("dialog.signupComplete.greeting", { nickname })}
            </p>
            <h2 className="title-2 w-full text-font-1">
              {t("dialog.signupComplete.title")}
            </h2>
          </div>

          <div className="body-4 w-full text-font-2">
            <p>{t("dialog.signupComplete.descriptionLine1")}</p>
            <p>{t("dialog.signupComplete.descriptionLine2")}</p>
          </div>
        </div>
      }
      confirmText="dialog.signupComplete.confirm"
      confirmFn={handleLogin}
    />
  );
};

export default SignupCompleteDialog;
