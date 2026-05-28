import z from "zod";

/** 회원가입 form 유효섬 */

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),

  pw: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "비밀번호는 특수문자를 포함해야 합니다."),
});

export type LoginFormValues = z.input<typeof loginFormSchema>;

/** 회원가입 form 유효섬 */
export const authFormSchema = z
  .object({
    nickname: z
      .string()
      .min(1, "닉네임을 입력해주세요.")
      .max(20, "닉네임은 20자 이하로 입력해주세요."),

    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),

    code: z
      .string()
      .min(1, "인증 코드를 입력해주세요.")
      .length(6, "인증 코드는 6자리여야 합니다."),

    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "비밀번호는 특수문자를 포함해야 합니다.",
      ),

    passwordCheck: z
      .string()
      .min(1, "비밀번호 확인을 입력해주세요.")
      .min(8, "비밀번호 확인은 8자 이상이어야 합니다.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "비밀번호 확인은 특수문자를 포함해야 합니다.",
      ),

    signupToken: z.string().min(1, "회원가입 토큰이 필요합니다."),

    isPrivacyAgreed: z.boolean().refine((value) => value === true, {
      message: "개인정보 처리방침에 동의해주세요.",
    }),

    isTermsAgreed: z.boolean().refine((value) => value === true, {
      message: "이용약관에 동의해주세요.",
    }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });
