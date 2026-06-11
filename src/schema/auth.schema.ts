import z from "zod";
import {
  EMAIL_REGEX,
  NICKNAME_REGEX,
  PASSWORD_REGEX,
  PASSWORD_SPECIAL_CHAR_REGEX,
} from "@/lib/regex";
import { FIELD_ERROR_MESSAGES } from "@/constants/fieldMessages";

const createEmailSchema = () =>
  z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.emailRequired)
    .regex(EMAIL_REGEX, FIELD_ERROR_MESSAGES.emailInvalid);

const createPasswordSchema = (requiredMessage: string) =>
  z.string().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: requiredMessage,
      });
      return;
    }

    if (PASSWORD_REGEX.test(value)) return;

    const hasSpecialChar = PASSWORD_SPECIAL_CHAR_REGEX.test(value);
    const isMin8 = value.length >= 8;

    if (!hasSpecialChar && !isMin8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FIELD_ERROR_MESSAGES.passwordInvalid,
      });
      return;
    }

    if (!hasSpecialChar && isMin8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FIELD_ERROR_MESSAGES.passwordSpecialCharRequired,
      });
      return;
    }

    if (hasSpecialChar && !isMin8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FIELD_ERROR_MESSAGES.passwordMinLength,
      });
    }
  });

/** 로그인 form 유효성 */
export const loginFormSchema = z.object({
  email: createEmailSchema(),

  pw: createPasswordSchema(FIELD_ERROR_MESSAGES.passwordRequired),
});

export type LoginFormValues = z.input<typeof loginFormSchema>;

/** 회원가입 form 유효성 */
export const authFormSchema = z
  .object({
    nickname: z
      .string()
      .min(1, FIELD_ERROR_MESSAGES.nicknameRequired)
      .max(20, FIELD_ERROR_MESSAGES.nicknameMaxLength)
      .regex(NICKNAME_REGEX, FIELD_ERROR_MESSAGES.nicknameInvalid),

    email: createEmailSchema(),

    code: z
      .string()
      .min(1, FIELD_ERROR_MESSAGES.verificationCodeRequired)
      .length(6, FIELD_ERROR_MESSAGES.verificationCodeLength),

    password: createPasswordSchema(FIELD_ERROR_MESSAGES.passwordRequired),
    passwordCheck: createPasswordSchema(
      FIELD_ERROR_MESSAGES.passwordCheckRequired,
    ),

    isPrivacyAgreed: z.boolean().refine((value) => value === true, {
      message: FIELD_ERROR_MESSAGES.privacyRequired,
    }),

    isTermsAgreed: z.boolean().refine((value) => value === true, {
      message: FIELD_ERROR_MESSAGES.termsRequired,
    }),
    isAgeAgreed: z
      .boolean()
      .refine((value) => value === true, {
        message: FIELD_ERROR_MESSAGES.ageRequired,
      })
      .optional(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ["passwordCheck"],
    message: FIELD_ERROR_MESSAGES.passwordMismatch,
  });

export type AuthFormValues = z.input<typeof authFormSchema>;

/** 비밀번호 재설정 form 유효성 */
export const passwordResetFormSchema = z
  .object({
    email: createEmailSchema(),
    code: z
      .string()
      .min(1, FIELD_ERROR_MESSAGES.verificationCodeRequired)
      .length(6, FIELD_ERROR_MESSAGES.verificationCodeLength),
    password: createPasswordSchema(FIELD_ERROR_MESSAGES.passwordRequired),
    passwordCheck: createPasswordSchema(
      FIELD_ERROR_MESSAGES.passwordCheckRequired,
    ),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ["passwordCheck"],
    message: FIELD_ERROR_MESSAGES.passwordMismatch,
  });

export type PasswordResetFormSchemaValues = z.input<
  typeof passwordResetFormSchema
>;
