/**
 * 탈퇴할 때 만든 캐릭터(세계관)마다 고르는 처리.
 * 미리 골라 두거나 고른 것으로 치면 안 되므로(법적 요건) 화면에도 기본값이 없다.
 */
export type WithdrawalChoice = "KEEP" | "DELETE";

/** 고를 수 없이 지워지는 캐릭터의 이유. */
export type WithdrawalDeletionReason =
  | "INACTIVE"
  | "PRIVATE"
  | "NOT_APPROVED"
  | "UNDER_REVIEW"
  | "NO_OTHER_ROOMS";

export const WITHDRAWAL_DELETION_REASONS: readonly WithdrawalDeletionReason[] = [
  "INACTIVE",
  "PRIVATE",
  "NOT_APPROVED",
  "UNDER_REVIEW",
  "NO_OTHER_ROOMS",
];

/** 남길지 지울지 골라야 하는 캐릭터. 다른 유저와의 대화가 남아 있는 공개 캐릭터다. */
export interface WithdrawalCandidate {
  universeId: string;
  title: string;
  profileImageUrl: string | null;
  visibility: "PUBLIC" | "UNLISTED";
  /** 이 캐릭터와 대화 중인 다른 유저의 방 수. */
  otherRoomCount: number;
}

/** 고를 수 없이 지워지는 캐릭터. */
export interface WithdrawalDeletion {
  universeId: string;
  title: string;
  reason: WithdrawalDeletionReason;
}

/** 캐릭터 이용허락 동의서. 남기기를 고르면 이 버전에 동의해야 한다. */
export interface HandoverConsentDocument {
  documentId: string;
  version: string;
  /** 마크다운 원문. */
  content: string;
}

/** GET /users/me/withdrawal/preview */
export interface WithdrawalPreview {
  /** false 면 남기기를 고를 수 없다(만 19세 미만이거나 동의서가 아직 없음). */
  keepAllowed: boolean;
  /** 남기기를 고를 수 없는 이유. MINOR: 생일상 만 19세 미만, CONSENT_UNAVAILABLE: 동의서 미게시. */
  keepBlockedReason: "MINOR" | "CONSENT_UNAVAILABLE" | null;
  /** 생일을 몰라 남기기를 고를 때 "만 19세 이상" 진술을 받아야 한다. */
  ageAttestationRequired: boolean;
  /** 후보가 없거나 남길 수 없으면 null. */
  consent: HandoverConsentDocument | null;
  candidates: WithdrawalCandidate[];
  deletions: WithdrawalDeletion[];
}

export interface WithdrawalDecision {
  universeId: string;
  choice: WithdrawalChoice;
}

/** POST /users/me/withdrawal 요청 */
export interface WithdrawalRequest {
  /** 후보 전부에 대한 선택. 하나라도 빠지거나 남으면 서버가 409 로 막는다. */
  decisions: WithdrawalDecision[];
  /** 남기기가 있을 때 동의한 동의서 id. 없으면 null. */
  consentDocumentId: string | null;
  adultAttested: boolean;
}

/** 남긴 캐릭터 한 편의 인수 접수. */
export interface WithdrawalHandover {
  handoverId: string;
  universeId: string;
  title: string;
  /** 운영 심사 기한(ISO). */
  deadlineAt: string;
}

/** POST /users/me/withdrawal 응답 */
export interface WithdrawalResult {
  handovers: WithdrawalHandover[];
  consent: {
    documentId: string;
    version: string;
    consentedAt: string;
  } | null;
  /** 동의서 사본을 이메일로 보내도록 접수했는지. */
  copyMailRequested: boolean;
}
