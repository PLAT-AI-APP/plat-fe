/** 본인인증 창을 띄우는 쪽. MOCK 은 dev 가짜 인증 페이지, PORTONE 은 포트원 SDK. */
export type IdentityVerificationProvider = "MOCK" | "PORTONE";

/** POST /verifications/identity 응답(201). 인증 건은 expiresAt 까지(10분) 유효하다. */
export interface StartIdentityVerificationResponse {
  verificationId: string;
  provider: IdentityVerificationProvider;
  expiresAt: string;
}

/** POST /verifications/identity/{verificationId}/confirm 응답. 새 access 토큰으로 바로 바꿔야 클레임이 반영된다. */
export interface ConfirmIdentityVerificationResponse {
  accessToken: string;
  identityVerifiedUntil: string;
  /** 인증된 생년월일이 만 19세 이상이라 성인인증까지 기록됐는지. */
  adult: boolean;
  adultVerifiedUntil: string | null;
}

/** dev 전용 가짜 인증 완료 요청. */
export interface CompleteDevIdentityVerificationRequest {
  name: string;
  /** YYYY-MM-DD */
  birth: string;
  gender: "MALE" | "FEMALE" | null;
}

/** PATCH /users/me/adult-content 응답. */
export interface AdultContentResponse {
  accessToken: string;
  adultContentEnabled: boolean;
}

/** 확정이 거절되는 이유. 만료·재사용(404)과 아직 인증 창에서 끝내지 않음(409). */
export const IDENTITY_VERIFICATION_NOT_FOUND = "IDENTITY_VERIFICATION_NOT_FOUND";
export const IDENTITY_VERIFICATION_INCOMPLETE = "IDENTITY_VERIFICATION_INCOMPLETE";

/** dev 인증 페이지가 인증 창을 연 화면(opener)에 완료를 알리는 메시지. */
export const IDENTITY_VERIFICATION_MESSAGE_TYPE = "plat:identity-verification-complete";

export interface IdentityVerificationMessage {
  type: typeof IDENTITY_VERIFICATION_MESSAGE_TYPE;
  verificationId: string;
}

export const isIdentityVerificationMessage = (
  data: unknown,
): data is IdentityVerificationMessage =>
  typeof data === "object" &&
  data !== null &&
  (data as { type?: unknown }).type === IDENTITY_VERIFICATION_MESSAGE_TYPE &&
  typeof (data as { verificationId?: unknown }).verificationId === "string";
