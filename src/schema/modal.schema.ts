import * as z from "zod";
import { FIELD_ERROR_MESSAGES } from "@/constants/fieldMessages";
import { REPORT_REASONS } from "@/type/report";

export const userNoteFormSchema = z.object({
  userNote: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.userNoteRequired)
    .max(500, FIELD_ERROR_MESSAGES.userNoteMaxLength),
});

export type UserNoteFormValues = z.input<typeof userNoteFormSchema>;

export const tagSuggestionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.tagNameRequired)
    .max(10, FIELD_ERROR_MESSAGES.tagNameMaxLength),
  opinion: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.opinionRequired)
    .max(200, FIELD_ERROR_MESSAGES.opinionMaxLength),
});

export type TagSuggestionFormValues = z.input<typeof tagSuggestionFormSchema>;

/** 신고 상세 입력 상한. 디자인의 글자 수 표시(0/500)에 맞춘다. 서버 상한(1000자)보다 작다. */
export const REPORT_DETAIL_MAX_LENGTH = 500;

export const reportFormSchema = z
  .object({
    // 칩을 아직 고르지 않은 상태를 빈 문자열로 두고, 고르지 않으면 선택을 요구한다.
    reason: z
      .union([z.enum(REPORT_REASONS), z.literal("")])
      .refine((value) => value !== "", FIELD_ERROR_MESSAGES.reportReasonRequired),
    detail: z
      .string()
      .trim()
      .max(REPORT_DETAIL_MAX_LENGTH, FIELD_ERROR_MESSAGES.reportDetailMaxLength),
  })
  // 기타는 사유 칩만으로 무엇이 문제인지 알 수 없어 서버도 detail 을 필수로 받는다.
  .refine((values) => values.reason !== "ETC" || values.detail.length > 0, {
    path: ["detail"],
    message: FIELD_ERROR_MESSAGES.reportDetailRequired,
  });

export type ReportFormValues = z.input<typeof reportFormSchema>;

export const personaFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.personaNameRequired)
    .max(20, FIELD_ERROR_MESSAGES.personaNameMaxLength),
  info: z.string().trim().max(200, FIELD_ERROR_MESSAGES.personaInfoMaxLength),
});

export type PersonaFormValues = z.input<typeof personaFormSchema>;
