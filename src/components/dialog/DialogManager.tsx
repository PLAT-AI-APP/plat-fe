"use client";

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

  if (!currentDialog) return null;

  const DialogComponent = DIALOG_COMPONENTS[
    currentDialog.type
  ] as ComponentType<typeof currentDialog.props & { onClose: () => void }>;

  return <DialogComponent {...currentDialog.props} onClose={closeDialog} />;
};

export default DialogManager;
