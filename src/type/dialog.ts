import type React from "react";

export interface DialogProps {
  onClose: () => void;
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  cancelText?: string;
  cancelFn?: () => void;
  confirmFn?: () => void;
  confirmText?: string;
  /** 확인을 누른 뒤 요청이 오가는 중. 확인 버튼에 대기 표시를 하고 다시 눌리지 않게 한다. */
  isConfirmPending?: boolean;
}

export interface CreditInsufficientDialogProps {
  onClose: () => void;
}

export interface DraftOverwriteDialogProps {
  onCancel: () => void;
  onClose: () => void;
  onConfirm?: () => void;
}

export interface DraftSaveOverwriteDialogProps {
  onCancel: () => void;
  onClose: () => void;
  onConfirm?: () => void;
}

export interface ChatRestartDialogProps {
  onClose: () => void;
  onConfirm?: () => void;
}

export interface CommentDeleteDialogProps {
  /** 답글 삭제인지. 댓글과 달리 하위 답글이 없어 안내 문구가 다르다. */
  isReply?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ChatLeaveDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

export interface ChatDeleteDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

/** 채팅방 안의 한 턴(내 말 + 캐릭터 답) 삭제 확인 */
export interface ChatTurnDeleteDialogProps {
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
  /** 삭제가 실패한 이유. 확인 다이얼로그를 연 흐름이라 사유도 이 안에서 말합니다. */
  errorMessage?: string;
}

export interface SignupCompleteDialogProps {
  nickname: string;
  /** 가입 때 받은 동의의 처리 결과. 있으면 창 아래에 함께 보여 준다. */
  agreement?: Omit<AgreementResultDialogProps, "onClose">;
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
  onClose: () => void;
  onConfirm: () => void;
}

export interface AgreementResultItem {
  /** `dialog.agreementResult.items` 아래 키. */
  type: "termsOfService" | "privacyPolicy" | "ageOver14" | "marketing";
  agreed: boolean;
  /** 이미 한 동의를 거둔 것이면 "미동의" 대신 "철회" 로 적는다. */
  withdrawn?: boolean;
  version?: string | null;
}

export interface AgreementResultDialogProps {
  onClose: () => void;
  /** 처리 시각(ISO). */
  processedAt: string;
  items: AgreementResultItem[];
}

type DialogWithoutManagerClose<T extends { onClose: () => void }> = Omit<
  T,
  "onClose"
>;

export type DialogTypeMap = {
  AGREEMENT_RESULT: DialogWithoutManagerClose<AgreementResultDialogProps>;
  CHAT_DELETE: DialogWithoutManagerClose<ChatDeleteDialogProps>;
  CHAT_LEAVE: DialogWithoutManagerClose<ChatLeaveDialogProps>;
  CHAT_RESTART: DialogWithoutManagerClose<ChatRestartDialogProps>;
  CHAT_TURN_DELETE: DialogWithoutManagerClose<ChatTurnDeleteDialogProps>;
  COMMENT_DELETE: DialogWithoutManagerClose<CommentDeleteDialogProps>;
  CREDIT_INSUFFICIENT: DialogWithoutManagerClose<CreditInsufficientDialogProps>;
  DRAFT_OVERWRITE: DialogWithoutManagerClose<DraftOverwriteDialogProps>;
  DRAFT_SAVE_OVERWRITE: DialogWithoutManagerClose<DraftSaveOverwriteDialogProps>;
  LOGIN_REQUIRED: DialogWithoutManagerClose<LoginRequiredDialogProps>;
  PERSONA_DELETE: DialogWithoutManagerClose<PersonaDeleteDialogProps>;
  SIGNUP_COMPLETE: DialogWithoutManagerClose<SignupCompleteDialogProps>;
  UNSAVED_CHANGES: DialogWithoutManagerClose<UnsavedChangesDialogProps>;
  USER_BLOCK: DialogWithoutManagerClose<UserBlockDialogProps>;
  WELCOME_CREDIT: DialogWithoutManagerClose<WelcomeCreditDialogProps>;
  WITHDRAWAL_COMPLETE: DialogWithoutManagerClose<WithdrawalCompleteDialogProps>;
  WITHDRAWAL_CONFIRM: DialogWithoutManagerClose<WithdrawalConfirmDialogProps>;
};
