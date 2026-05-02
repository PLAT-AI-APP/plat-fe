/** 로그인 form */
export interface LoginFormValues {
  email: string;
  password: string;
}

/** 비밀번호 재설정 page form */
export interface PasswordResetFormValues extends LoginFormValues {
  otp: string[] | string;
  passwordCheck: string;
  emailVerifyToken: string;
}

/** 회원가입 page form */
export interface AuthFormValues extends PasswordResetFormValues {
  nickname: string;

  signupToken: string;
  isTermsAgreed: boolean;
  isPrivacyAgreed: boolean;
}

export interface UserDetailFormValues {
  nickname: string;
  gender: "MALE" | "FEMALE" | "";
  birth: string;
  signupToken: string;
}

export type AuthMode = "SIGNUP" | "RESET_PASSWORD";
