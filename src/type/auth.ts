export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthFormValues extends Partial<LoginFormValues> {
  // Step1 필드
  otp: string[];

  // Step2 필드
  passwordConfirm?: string;

  emailVerifyToken: string;
  signupToken: string;
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
