/** 인증·가입 관련 캐시 키의 단일 출처. */
export const authQueryKeys = {
  /** 닉네임 중복 조회. 입력값마다 결과가 다르다. */
  checkNickname: (nickname: string) =>
    ["get-check-nickname", nickname] as const,
};
