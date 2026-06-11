import { z } from "zod";
import { EMAIL_REGEX, NICKNAME_REGEX } from "@/lib/regex";
import { FIELD_ERROR_MESSAGES } from "@/constants/fieldMessages";

const isFutureDate = (value: string) => {
  if (!value) return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isValidDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  if (!isValidDate) return false;

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
  bio: z
    .string()
    .trim()
    .max(100, FIELD_ERROR_MESSAGES.bioMaxLength)
    .optional(),
  birth: z
    .string()
    .refine((value) => !isFutureDate(value), FIELD_ERROR_MESSAGES.birthFuture),
  gender: z.enum(["MALE", "FEMALE", ""]),
  email: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.emailRequired)
    .regex(EMAIL_REGEX, FIELD_ERROR_MESSAGES.emailInvalid),
  provider: z.enum(["KAKAO", "GOOGLE", "EMAIL"]),
});

export type ProfileEditFormType = z.input<typeof profileEditFormSchema>;
