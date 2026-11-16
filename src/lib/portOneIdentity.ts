/**
 * 포트원 V2 본인인증(KCP 휴대폰 본인인증).
 *
 * 인증 건 아이디는 서버가 만든 verificationId 를 그대로 쓴다. 창에서 끝낸 뒤 서버가 포트원에 되물어 확정하므로
 * 여기서는 "창이 끝났다" 만 알린다. 채널 키는 공개값이고, 서버가 이 환경의 채널로 인증한 건만 받는다.
 */

import type { IdentityVerificationPurpose } from "@/type/modal";
import { loadSdk } from "./portOnePayment";

const STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? "";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_IDENTITY_CHANNEL_KEY ?? "";

/** 모바일에서 인증을 마치고 돌아오는 페이지. 이 페이지가 확정까지 마친다. */
export const PORTONE_IDENTITY_RETURN_PATH = "/identity-verification/complete";

/** 본인인증 채널이 설정되지 않았음을 알리는 오류. 모달이 "준비 중" 문구로 바꿔 보여 준다. */
export class PortOneIdentityNotReadyError extends Error {
  constructor() {
    super("PORTONE_IDENTITY_VERIFICATION_NOT_READY");
    this.name = "PortOneIdentityNotReadyError";
  }
}

/**
 * 포트원 본인인증 창을 띄우고 사용자가 끝낼 때까지 기다린다. 끝나면 호출부가 확정 API 를 부른다.
 * PC 는 팝업이 닫히면 돌아오고, 모바일은 이 화면을 떠나 복귀 페이지로 돌아온다(이 약속은 끝나지 않는다).
 */
export const requestPortOneIdentityVerification = async (
  verificationId: string,
  purpose: IdentityVerificationPurpose,
): Promise<void> => {
  if (!STORE_ID || !CHANNEL_KEY) throw new PortOneIdentityNotReadyError();

  const returnTo = `${window.location.pathname}${window.location.search}`;
  const PortOne = await loadSdk();
  const response = await PortOne.requestIdentityVerification({
    storeId: STORE_ID,
    channelKey: CHANNEL_KEY,
    identityVerificationId: verificationId,
    redirectUrl: `${window.location.origin}${PORTONE_IDENTITY_RETURN_PATH}?purpose=${purpose}&returnTo=${encodeURIComponent(returnTo)}`,
  });
  // 창을 닫았거나 인증에 실패했다.
  if (response?.code !== undefined) {
    throw new Error(response.message ?? response.code);
  }
};
