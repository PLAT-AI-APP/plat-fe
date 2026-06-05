import { z } from "zod";

export const userNoteFormSchema = z.object({
  userNote: z
    .string()
    .trim()
    .min(1, "유저노트를 입력해주세요.")
    .max(500, "유저노트는 최대 500자까지 입력 가능합니다."),
});

export type UserNoteFormValues = z.input<typeof userNoteFormSchema>;

export const tagSuggestionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "해시태그를 입력해주세요.")
    .max(10, "해시태그는 최대 10자까지 입력 가능합니다."),
  opinion: z
    .string()
    .trim()
    .min(1, "의견을 입력해주세요.")
    .max(200, "의견은 최대 200자까지 입력 가능합니다."),
});

export type TagSuggestionFormValues = z.input<typeof tagSuggestionFormSchema>;

export const storageFormSchema = z.object({
  longTermMemory: z
    .string()
    .trim()
    .min(1, "장기기억을 입력해주세요.")
    .max(2000, "장기기억은 최대 2000자까지 입력 가능합니다."),
});

export type StorageFormValues = z.input<typeof storageFormSchema>;

export const personaFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요.")
    .max(20, "이름은 최대 20자까지 입력 가능합니다."),
  info: z
    .string()
    .trim()
    .max(200, "정보는 최대 200자까지 입력 가능합니다."),
});

export type PersonaFormValues = z.input<typeof personaFormSchema>;
