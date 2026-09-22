"use client";

import { useIsMutating } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DELETE_PERSONA_MUTATION_KEY } from "@/api/persona/deletePersona";
import type { PersonaDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const PersonaDeleteDialog = ({
  personaName,
  errorMessage,
  onClose,
  onConfirm,
}: PersonaDeleteDialogProps) => {
  const t = useTranslations();
  // Dialog는 열릴 때 props가 고정되므로 진행 상태는 뮤테이션에서 직접 구독합니다.
  const isPending =
    useIsMutating({ mutationKey: DELETE_PERSONA_MUTATION_KEY }) > 0;

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
      isConfirmPending={isPending}
    />
  );
};

export default PersonaDeleteDialog;
