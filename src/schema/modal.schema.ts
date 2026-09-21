import * as z from "zod";
import { FIELD_ERROR_MESSAGES } from "@/constants/fieldMessages";

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

/** 신고 사유 입력 상한. 서버 상한(2000자)보다 작게, 디자인의 글자 수 표시(0/500)에 맞춘다. */
export const COMMENT_REPORT_CONTENT_MAX_LENGTH = 500;

export const commentReportFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.commentReportContentRequired)
    .max(
      COMMENT_REPORT_CONTENT_MAX_LENGTH,
      FIELD_ERROR_MESSAGES.commentReportContentMaxLength,
    ),
});

export type CommentReportFormValues = z.input<typeof commentReportFormSchema>;

export const personaFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.personaNameRequired)
    .max(20, FIELD_ERROR_MESSAGES.personaNameMaxLength),
  info: z.string().trim().max(200, FIELD_ERROR_MESSAGES.personaInfoMaxLength),
});

export type PersonaFormValues = z.input<typeof personaFormSchema>;
