"use client";

import { useTranslations } from "next-intl";
import type { PersonaDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const PersonaDeleteDialog = ({
  personaName,
  errorMessage,
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
      description={
        // 페르소나 이름은 사용자 입력값이므로 번역하지 않고, 뒤에 붙는 고정 안내 문구만 i18n으로 처리합니다.
        <span className="flex flex-col gap-2">
          <span className="body-5 text-font-2">
            {personaName}
            {t("dialog.personaDelete.description")}
          </span>
          {errorMessage && (
            <span className="body-5 text-font-error">{errorMessage}</span>
          )}
        </span>
      }
      confirmFn={onConfirm}
    />
  );
};

export default PersonaDeleteDialog;
