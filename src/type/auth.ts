export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthFormValues extends Partial<LoginFormValues> {
  // Step1 필드
  otp: string[];

  // Step2 필드
  passwordConfirm?: string;

  // Step3 필드
  nickname: string;
  gender: "MALE" | "FEMALE" | "";
  birthdate: string;

  emailVerifyToken: string;
  signupToken: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export type AuthMode = "SIGNUP" | "RESET_PASSWORD";
