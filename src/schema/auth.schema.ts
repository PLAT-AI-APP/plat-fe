import z from "zod";

const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

const createPasswordSchema = (requiredMessage: string) =>
  z.string().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: requiredMessage,
      });
      return;
    }

    const hasSpecialChar = SPECIAL_CHAR_REGEX.test(value);
    const isMin8 = value.length >= 8;

    if (!hasSpecialChar && !isMin8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "특수 문자 포함, 최소 8자 입력해 주세요",
      });
      return;
    }

    if (!hasSpecialChar && isMin8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "!, @, #, $ 등의 특수문자를 사용해 주세요",
      });
      return;
    }

    if (hasSpecialChar && !isMin8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "최소 8자 이상이어야 해요",
      });
    }
  });

/** 회원가입 form 유효성 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("잘못된 이메일 형식에요"),

  pw: createPasswordSchema("비밀번호를 입력해주세요."),
});

export type LoginFormValues = z.input<typeof loginFormSchema>;

/** 회원가입 form 유효성 */
export const authFormSchema = z
  .object({
    nickname: z
      .string()
      .min(1, "닉네임을 입력해주세요.")
      .max(20, "닉네임은 20자 이하로 입력해주세요.")
      .refine(
        (value) => !/[`~!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|]/.test(value),
        {
          message: "특수문자는 사용이 불가해요",
        },
      ),

    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("잘못된 이메일 형식에요"),

    code: z
      .string()
      .min(1, "인증 코드를 입력해주세요.")
      .length(6, "인증 코드는 6자리여야 합니다."),

    password: createPasswordSchema("비밀번호를 입력해주세요."),
    passwordCheck: createPasswordSchema("비밀번호 확인을 입력해주세요."),

    isPrivacyAgreed: z.boolean().refine((value) => value === true, {
      message: "개인정보 처리방침에 동의해주세요.",
    }),

    isTermsAgreed: z.boolean().refine((value) => value === true, {
      message: "이용약관에 동의해주세요.",
    }),
    isAgeAgreed: z
      .boolean()
      .refine((value) => value === true, {
        message: "이용약관에 동의해주세요.",
      })
      .optional(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type AuthFormValues = z.input<typeof authFormSchema>;

/** 비밀번호 재설정 form 유효성 */
export const passwordResetFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("잘못된 이메일 형식에요"),
    code: z
      .string()
      .min(1, "인증 코드를 입력해주세요.")
      .length(6, "인증 코드는 6자리여야 합니다."),
    password: createPasswordSchema("비밀번호를 입력해주세요."),
    passwordCheck: createPasswordSchema("비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type PasswordResetFormSchemaValues = z.input<
  typeof passwordResetFormSchema
>;
