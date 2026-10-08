/** 포트원 본인인증이 아직 연결되지 않았음을 알리는 오류. 모달이 "준비 중" 문구로 바꿔 보여 준다. */
export class PortOneIdentityNotReadyError extends Error {
  constructor() {
    super("PORTONE_IDENTITY_VERIFICATION_NOT_READY");
    this.name = "PortOneIdentityNotReadyError";
  }
}

/**
 * 포트원 본인인증 창을 띄우고 사용자가 끝낼 때까지 기다린다. 끝나면 호출부가 확정 API 를 부른다.
 *
 * TODO: 포트원 V2 브라우저 SDK(@portone/browser-sdk) 를 붙여 requestIdentityVerification 에
 *  storeId·channelKey·identityVerificationId(= verificationId) 를 넘기고, 모바일 리다이렉트 복귀도 처리한다.
 *  상점·채널 키가 정해지기 전까지는 서버가 provider 를 MOCK 으로 준다.
 */
export const requestPortOneIdentityVerification = async (
  verificationId: string,
): Promise<void> => {
  void verificationId;
  throw new PortOneIdentityNotReadyError();
};
