export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthFormValues extends LoginFormValues {
  nickname: string;
  otp: string[];
  passwordConfirm?: string;
  emailVerifyToken: string;
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

export interface LoginFormValues {
  email: string;
  password: string;
}

export type AuthMode = "SIGNUP" | "RESET_PASSWORD";
