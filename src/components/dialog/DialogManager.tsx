"use client";

import { AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";
import { useDialogStore } from "@/store/useDialogStore";
import type { DialogTypeMap } from "@/type/dialog";
import ChatLeaveDialog from "./ChatLeaveDialog";
import ChatRestartDialog from "./ChatRestartDialog";
import DraftOverwriteDialog from "./DraftOverwriteDialog";
import LoginRequiredDialog from "./LoginRequiredDialog";
import PersonaDeleteDialog from "./PersonaDeleteDialog";
import SignupCompleteDialog from "./SignupCompleteDialog";
import UnsavedChangesDialog from "./UnsavedChangesDialog";
import UserBlockDialog from "./UserBlockDialog";
import WelcomeCreditDialog from "./WelcomeCreditDialog";
import WithdrawalCompleteDialog from "./WithdrawalCompleteDialog";
import WithdrawalConfirmDialog from "./WithdrawalConfirmDialog";

const DIALOG_COMPONENTS: {
  [K in keyof DialogTypeMap]: ComponentType<
    DialogTypeMap[K] & { onClose: () => void }
  >;
} = {
  CHAT_LEAVE: ChatLeaveDialog,
  CHAT_RESTART: ChatRestartDialog,
  DRAFT_OVERWRITE: DraftOverwriteDialog,
  LOGIN_REQUIRED: LoginRequiredDialog,
  PERSONA_DELETE: PersonaDeleteDialog,
  SIGNUP_COMPLETE: SignupCompleteDialog,
  UNSAVED_CHANGES: UnsavedChangesDialog,
  USER_BLOCK: UserBlockDialog,
  WELCOME_CREDIT: WelcomeCreditDialog,
  WITHDRAWAL_COMPLETE: WithdrawalCompleteDialog,
  WITHDRAWAL_CONFIRM: WithdrawalConfirmDialog,
};

const DialogManager = () => {
  const currentDialog = useDialogStore((state) => state.currentDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);

  const DialogComponent = currentDialog
    ? (DIALOG_COMPONENTS[currentDialog.type] as ComponentType<
        typeof currentDialog.props & { onClose: () => void }
      >)
    : null;

  /*
   * AnimatePresence 가 없으면 currentDialog 가 비는 순간 즉시 언마운트되어
   * ModalLayout 이 정의한 exit 애니메이션이 11개 다이얼로그 전부에서
   * 재생되지 않았다(열릴 때만 부드럽고 닫힐 때는 뚝 사라짐).
   */
  return (
    <AnimatePresence>
      {currentDialog && DialogComponent && (
        <DialogComponent
          key={currentDialog.type}
          {...currentDialog.props}
          onClose={closeDialog}
        />
      )}
    </AnimatePresence>
  );
};

export default DialogManager;
