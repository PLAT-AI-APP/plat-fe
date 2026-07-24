import type React from "react";

export interface DialogProps {
  onClose: () => void;
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  cancelText?: string;
  cancelFn?: () => void;
  confirmFn?: () => void;
  confirmText?: string;
}

export interface DraftOverwriteDialogProps {
  onCancel: () => void;
  onClose: () => void;
  onConfirm?: () => void;
}

export interface ChatRestartDialogProps {
  onClose: () => void;
  onConfirm?: () => void;
}

export interface ChatLeaveDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

export interface LoginRequiredDialogProps {
  confirmText?: string;
  description?: string;
  label: string;
  onClose: () => void;
  onConfirm: () => void;
}

export interface PersonaDeleteDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  personaName: string;
}

export interface SignupCompleteDialogProps {
  nickname: string;
  onClose: () => void;
  onLogin: () => void;
}

export interface UnsavedChangesDialogProps {
  onCancel: () => void;
  onClose: () => void;
  onLeave: () => void;
}

export interface UserBlockDialogProps {
  nickname: string;
  onClose: () => void;
  onConfirm: () => void;
}

export interface WelcomeCreditDialogProps {
  onClose: () => void;
  onConfirm?: () => void;
}

export interface WithdrawalCompleteDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

export interface WithdrawalConfirmDialogProps {
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

type DialogWithoutManagerClose<T extends { onClose: () => void }> = Omit<
  T,
  "onClose"
>;

export type DialogTypeMap = {
  CHAT_LEAVE: DialogWithoutManagerClose<ChatLeaveDialogProps>;
  CHAT_RESTART: DialogWithoutManagerClose<ChatRestartDialogProps>;
  DRAFT_OVERWRITE: DialogWithoutManagerClose<DraftOverwriteDialogProps>;
  LOGIN_REQUIRED: DialogWithoutManagerClose<LoginRequiredDialogProps>;
  PERSONA_DELETE: DialogWithoutManagerClose<PersonaDeleteDialogProps>;
  SIGNUP_COMPLETE: DialogWithoutManagerClose<SignupCompleteDialogProps>;
  UNSAVED_CHANGES: DialogWithoutManagerClose<UnsavedChangesDialogProps>;
  USER_BLOCK: DialogWithoutManagerClose<UserBlockDialogProps>;
  WELCOME_CREDIT: DialogWithoutManagerClose<WelcomeCreditDialogProps>;
  WITHDRAWAL_COMPLETE: DialogWithoutManagerClose<WithdrawalCompleteDialogProps>;
  WITHDRAWAL_CONFIRM: DialogWithoutManagerClose<WithdrawalConfirmDialogProps>;
};
