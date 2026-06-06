import { z } from "zod";
import { EMAIL_REGEX, NICKNAME_REGEX } from "@/lib/regex";

export const profileEditFormSchema = z.object({
  profileImg: z.string(),
  profileImgFile: z.custom<File | "">(
    (value) => value === "" || value instanceof File,
  ),
  nickname: z
    .string()
    .trim()
    .min(1, "닉네임을 입력해주세요.")
    .max(20, "닉네임은 20자 이하로 입력해주세요.")
    .regex(NICKNAME_REGEX, "중복되거나, 특수문자는 사용할 수 없어요"),
  bio: z
    .string()
    .trim()
    .max(50, "소개글은 최대 50자까지 입력 가능합니다.")
    .optional(),
  birth: z.string(),
  gender: z.enum(["MALE", "FEMALE", ""]),
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .regex(EMAIL_REGEX, "잘못된 이메일 형식에요"),
  provider: z.enum(["KAKAO", "GOOGLE", "EMAIL"]),
});

export type ProfileEditFormType = z.input<typeof profileEditFormSchema>;
