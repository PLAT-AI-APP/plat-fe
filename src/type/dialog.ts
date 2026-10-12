import type { OwnCardReview } from "@/type/card";
import type React from "react";
import type { WithdrawalHandover } from "@/type/withdrawal";

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
  /** 제목 위 연출 띠(DialogHero). 있으면 제목·설명이 띠 뒤로 차례로 떠오른다. */
  hero?: React.ReactNode;
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

export interface AdultReleaseConfirmDialogProps {
  onClose: () => void;
  /** 해제하고 저장하기로 했을 때. */
  onConfirm: () => void;
  /** 취소하거나 창을 닫았을 때. 저장을 이어 가지 않게 호출부가 기다리는 약속을 풀어 준다. */
  onCancel?: () => void;
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

export interface ChatTurnRegenerateDialogProps {
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

/** 내 캐릭터의 검수 결과(검수 중·운영자 확인 중·반려 사유) */
export interface ContentReviewDialogProps {
  onClose: () => void;
  review: OwnCardReview;
  /** 반려일 때 "수정하기"가 보낼 곳 */
  editHref: string;
}

/** 답변 대기 중인 1:1 문의 취소 확인 */
export interface QnaCancelDialogProps {
  onClose: () => void;
  onConfirm: () => void;
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
  /** 남긴 캐릭터의 인수 접수. 없으면 목록을 그리지 않는다. */
  handovers?: (Pick<WithdrawalHandover, "handoverId" | "title" | "deadlineAt"> & {
    /** 탈퇴 화면 미리보기에서 받아 둔 대표 이미지. 접수증에 썸네일로 보인다. */
    profileImageUrl?: string | null;
  })[];
  /** 동의서 사본을 이메일로 보냈는지. */
  copyMailRequested?: boolean;
  /** 남긴 캐릭터가 있을 때 동의한 이용허락 동의서 버전과 동의 시각. */
  consent?: { version: string; consentedAt: string } | null;
}

export interface WithdrawalConfirmDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  /** 남겨서 운영 심사를 거칠 캐릭터 수. 만든 캐릭터가 없으면 0. */
  keepCount?: number;
  /** 탈퇴와 함께 지워질 캐릭터 수. */
  deleteCount?: number;
}

export interface AgreementResultItem {
  /** `dialog.agreementResult.items` 아래 키. */
  type: "termsOfService" | "privacyPolicy" | "ageOver14" | "marketing";
  agreed: boolean;
  /** 이미 한 동의를 거둔 것이면 "미동의" 대신 "철회" 로 적는다. */
  withdrawn?: boolean;
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
  ADULT_RELEASE_CONFIRM: DialogWithoutManagerClose<AdultReleaseConfirmDialogProps>;
  CHAT_DELETE: DialogWithoutManagerClose<ChatDeleteDialogProps>;
  CHAT_LEAVE: DialogWithoutManagerClose<ChatLeaveDialogProps>;
  CHAT_RESTART: DialogWithoutManagerClose<ChatRestartDialogProps>;
  CHAT_TURN_DELETE: DialogWithoutManagerClose<ChatTurnDeleteDialogProps>;
  CHAT_TURN_REGENERATE: DialogWithoutManagerClose<ChatTurnRegenerateDialogProps>;
  COMMENT_DELETE: DialogWithoutManagerClose<CommentDeleteDialogProps>;
  CONTENT_REVIEW: DialogWithoutManagerClose<ContentReviewDialogProps>;
  CREDIT_INSUFFICIENT: DialogWithoutManagerClose<CreditInsufficientDialogProps>;
  DRAFT_OVERWRITE: DialogWithoutManagerClose<DraftOverwriteDialogProps>;
  DRAFT_SAVE_OVERWRITE: DialogWithoutManagerClose<DraftSaveOverwriteDialogProps>;
  LOGIN_REQUIRED: DialogWithoutManagerClose<LoginRequiredDialogProps>;
  PERSONA_DELETE: DialogWithoutManagerClose<PersonaDeleteDialogProps>;
  QNA_CANCEL: DialogWithoutManagerClose<QnaCancelDialogProps>;
  SIGNUP_COMPLETE: DialogWithoutManagerClose<SignupCompleteDialogProps>;
  UNSAVED_CHANGES: DialogWithoutManagerClose<UnsavedChangesDialogProps>;
  USER_BLOCK: DialogWithoutManagerClose<UserBlockDialogProps>;
  WELCOME_CREDIT: DialogWithoutManagerClose<WelcomeCreditDialogProps>;
  WITHDRAWAL_COMPLETE: DialogWithoutManagerClose<WithdrawalCompleteDialogProps>;
  WITHDRAWAL_CONFIRM: DialogWithoutManagerClose<WithdrawalConfirmDialogProps>;
};
