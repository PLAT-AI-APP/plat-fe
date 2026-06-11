/** input 하단에 위치하는 기본 메시지 모음 */
export const FIELD_HELPER_MESSAGES = {
  nickname: "특수문자는 사용할 수 없어요",
  nicknameWithDuplication: "중복되거나, 특수문자는 사용할 수 없어요",
  emailDomain: ".com으로 끝나는 이메일을 사용해요",
  password: "특수 문자 포함, 최소 8자 입력해 주세요",
  passwordCheck: "비밀번호를 한 번 더 입력해 주세요",
  bio: "소개글을 작성해주세요",
  birth: "태어난 날짜를 입력해 주세요",
} as const;

/** input 하단에 위치하는 특정 조건 만족 메시지 모음 */
export const FIELD_FEEDBACK_MESSAGES = {
  nicknameAvailable: "멋진 닉네임이에요",
  nicknameUnavailable: "이미 사용 중인 닉네임이에요",
  emailVerificationSent: "메일함에서 인증번호를 확인해 주세요",
  emailVerificationComplete: "이메일 인증이 완료되었습니다.",
  emailVerificationExpired: "시간이 초과되었습니다.",
  emailVerificationMismatch: "인증번호가 일치하지 않습니다.",
  birthValid: "소중한 날이네요, 잘 기억해 둘게요",
} as const;

/** form/schema 유효성 에러 메시지 모음 */
export const FIELD_ERROR_MESSAGES = {
  emailRequired: "이메일을 입력해주세요.",
  emailInvalid: "올바른 이메일 형식이에요",

  passwordRequired: "비밀번호를 입력해주세요.",
  passwordCheckRequired: "비밀번호 확인을 입력해주세요.",
  passwordInvalid: "특수 문자 포함, 최소 8자 입력해 주세요",
  passwordSpecialCharRequired: "!, @, #, $ 등의 특수문자를 사용해 주세요",
  passwordMinLength: "최소 8자 이상이어야 해요",
  passwordMismatch: "비밀번호를 한 번 더 확인해 주세요",

  nicknameRequired: "닉네임을 입력해주세요.",
  nicknameMaxLength: "20자 이내의 닉네임을 사용해요",
  nicknameInvalid: "특수문자는 사용할 수 없어요",

  verificationCodeRequired: "인증 코드를 입력해주세요.",
  verificationCodeLength: "인증 코드는 6자리여야 합니다.",

  privacyRequired: "개인정보 처리방침에 동의해주세요.",
  termsRequired: "이용약관에 동의해주세요.",
  ageRequired: "이용약관에 동의해주세요.",

  bioMaxLength: "소개글은 최대 100자까지 입력 가능해요",
  birthInvalid: "__BIRTH_INVALID_DATE__",
  birthFuture: "아직 오지 않은 날짜예요. 다시 확인해 볼까요?",

  userNoteRequired: "유저노트를 입력해주세요.",
  userNoteMaxLength: "유저노트는 최대 500자까지 입력 가능해요",
  tagNameRequired: "해시태그를 입력해주세요.",
  tagNameMaxLength: "해시태그는 최대 10자까지 입력 가능해요",
  opinionRequired: "의견을 입력해주세요.",
  opinionMaxLength: "의견은 최대 200자까지 입력 가능해요",
  longTermMemoryRequired: "장기기억을 입력해주세요.",
  longTermMemoryMaxLength: "장기기억은 최대 2000자까지 입력 가능해요",
  personaNameRequired: "이름을 입력해주세요.",
  personaNameMaxLength: "이름은 최대 20자까지 입력 가능해요",
  personaInfoMaxLength: "정보는 최대 200자까지 입력 가능해요",

  representativeImageRequired: "대표 이미지를 등록해주세요.",
  characterTitleRequired: "제목을 입력해주세요.",
  characterTitleMaxLength: "제목은 최대 20자까지 입력 가능해요",
  characterNameRequired: "캐릭터 이름을 입력해주세요.",
  characterNameMaxLength: "캐릭터 이름은 최대 20자까지 입력 가능해요",
  characterIntroduceRequired: "캐릭터 소개를 입력해주세요.",
  characterIntroduceMaxLength: "캐릭터 소개는 최대 30자까지 입력 가능해요",
  characterDetailSettingRequired: "캐릭터 상세 설정을 입력해주세요.",
  characterDetailSettingMaxLength: "상세 설정은 최대 2000자까지 입력 가능해요",
  assetNameRequired: "에셋 이름을 입력해주세요.",
  assetNameMaxLength: "에셋 이름은 최대 15자까지 입력 가능해요",
  assetSituationRequired: "에셋 상황을 입력해주세요.",
  assetSituationMaxLength: "상황 설명은 최대 50자까지 입력 가능해요",
  assetMaxCount: "에셋은 최대 50개까지만 등록 가능합니다.",
  scenarioNameRequired: "시나리오 이름을 입력해주세요.",
  scenarioContentRequired: "내용을 입력해주세요.",
  scenarioContentMaxLength: "내용은 최대 1500자까지 입력 가능해요",
  scenarioMaxCount: "시나리오는 최대 5개까지 생성할 수 있습니다.",
  characterDescriptionRequired: "캐릭터 설명을 입력해주세요.",
  characterDescriptionMaxLength: "캐릭터 설명은 최대 1000자까지 입력 가능해요",
  tendencyRequired: "성향을 선택해주세요.",
  categoryRequired: "카테고리를 선택해주세요.",
  tagMaxCount: "태그는 최대 5개까지만 등록 가능합니다.",
} as const;
