/** 탈퇴 때 인수 후보 세계관을 남길지 지울지. */
export type HandoverChoice = "KEEP" | "DELETE";

/** 남기기를 고를 수 없는 이유. */
export type KeepBlockedReason = "MINOR" | "CONSENT_UNAVAILABLE";

/** 남길 수 없어 지워지는 세계관의 이유. */
export type HandoverIneligibility =
  | "INACTIVE"
  | "PRIVATE"
  | "NOT_APPROVED"
  | "UNDER_REVIEW"
  | "NO_OTHER_ROOMS";

export interface WithdrawalCandidate {
  universeId: string;
  title: string;
  profileImageUrl: string | null;
  /** 제작자 말고 이 세계관에서 대화한 방의 수. */
  otherRoomCount: number;
}

export interface WithdrawalDeletion {
  universeId: string;
  title: string;
  reason: HandoverIneligibility;
}

export interface WithdrawalConsent {
  documentId: string;
  version: string;
  content: string;
}

/** GET /users/me/withdrawal/preview 응답 */
export interface WithdrawalPreview {
  /** 남기기를 고를 수 있는지. 만 19세 미만이거나 동의서가 없으면 false. */
  keepAllowed: boolean;
  /** 남길 후보가 있는데 남기기를 고를 수 없는 이유. */
  keepBlockedReason: KeepBlockedReason | null;
  /** 생일이 없어 남기려면 만 19세 이상 진술이 필요한지. */
  ageAttestationRequired: boolean;
  /** 남길 후보가 있고 남길 수 있을 때의 동의서. */
  consent: WithdrawalConsent | null;
  candidates: WithdrawalCandidate[];
  deletions: WithdrawalDeletion[];
}

/** POST /users/me/withdrawal 요청. 후보마다 선택이 하나씩 있어야 하고, 빠지면 409 다. */
export interface WithdrawalRequest {
  decisions: { universeId: string; choice: HandoverChoice }[];
  /** 남기기를 하나라도 골랐을 때 미리보기의 동의서 ID. */
  consentDocumentId: string | null;
  /** 나이 진술을 요구받았고 남기기를 골랐으면 true. */
  adultAttested: boolean;
}
