export interface PersonaType {
  id: string;
  name: string;
  description: string;
  isDefault: boolean; // '기본' 태그 여부
  isSelected: boolean; // 체크 표시(선택됨) 여부
}

export interface ProfileEditFormType {
  /** 프로필 이미지 */
  profileImg: string;

  /** 닉네임 (최대 15자) */
  nickname: string;

  /** 소개글 (최대 50자) */
  introduce?: string;

  /** 생년월일 (YYYY-MM-DD 형식) */
  birthDate: string;

  /** 성별 */
  gender: "male" | "female";

  /** 휴대폰 번호 (국가코드 포함) */
  countryCode?: string;
  phoneNumber?: string;

  /** 계정 이메일 (Read-only인 경우가 많지만 폼 타입에는 포함) */
  email: string;
  provider: "google" | "kakao" | "plat"; // 로그인 제공자 추가
}
