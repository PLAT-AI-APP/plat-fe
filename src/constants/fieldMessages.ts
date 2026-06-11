/** input 하단의 위치하는 기본 메세지 모음 */
export const FIELD_HELPER_MESSAGES = {
  nickname: "특수문자는 사용할 수 없어요",
  nicknameWithDuplication: "중복되거나, 특수문자는 사용할 수 없어요",
  emailDomain: ".com으로 끝나는 이메일을 사용해요",
  password: "특수 문자 포함, 최소 8자 입력해 주세요",
  passwordCheck: "비밀번호를 한 번 더 입력해 주세요",
  bio: "소개글을 작성해주세요",
  birth: "태어난 날짜를 입력해 주세요",
} as const;

/** input 하단의 위치하는 특정 조건을 만족할 떄 메세지 모음 */
export const FIELD_FEEDBACK_MESSAGES = {
  nicknameAvailable: "멋진 닉네임이에요",
  nicknameUnavailable: "이미 사용 중인 닉네임이에요",
  emailVerificationSent: "메일함에서 인증번호를 확인해 주세요",
  emailVerificationComplete: "이메일 인증이 완료되었습니다.",
  emailVerificationExpired: "시간이 초과되었습니다.",
  emailVerificationMismatch: "인증번호가 일치하지 않습니다.",
} as const;
