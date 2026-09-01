import { z } from "zod";
import { EMAIL_REGEX, NICKNAME_REGEX } from "@/lib/regex";
import { FIELD_ERROR_MESSAGES } from "@/constants/fieldMessages";

const getBirthDateParts = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
};

const isExistingDate = (value: string) => {
  const parts = getBirthDateParts(value);
  if (!parts) return false;

  const date = new Date(parts.year, parts.month - 1, parts.day);
  return (
    date.getFullYear() === parts.year &&
    date.getMonth() === parts.month - 1 &&
    date.getDate() === parts.day
  );
};

const isFutureDate = (value: string) => {
  if (!isExistingDate(value)) return false;

  const parts = getBirthDateParts(value);
  if (!parts) return false;

  const date = new Date(parts.year, parts.month - 1, parts.day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() > today.getTime();
};

export const profileEditFormSchema = z.object({
  profileImg: z.string(),
  profileImgFile: z.custom<File | "">(
    (value) => value === "" || value instanceof File,
  ),
  nickname: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.nicknameRequired)
    .max(20, FIELD_ERROR_MESSAGES.nicknameMaxLength)
    .regex(NICKNAME_REGEX, FIELD_ERROR_MESSAGES.nicknameInvalid),
  bio: z.string().trim().max(100, FIELD_ERROR_MESSAGES.bioMaxLength).optional(),
  birth: z.string().superRefine((value, ctx) => {
    if (value.length === 10 && !isExistingDate(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FIELD_ERROR_MESSAGES.birthInvalid,
      });
      return;
    }

    if (isFutureDate(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FIELD_ERROR_MESSAGES.birthFuture,
      });
    }
  }),
  gender: z.enum(["MALE", "FEMALE", ""]),
  email: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.emailRequired)
    .regex(EMAIL_REGEX, FIELD_ERROR_MESSAGES.emailInvalid),
  provider: z.enum(["KAKAO", "GOOGLE", "EMAIL"]),
});

export type ProfileEditFormType = z.input<typeof profileEditFormSchema>;
