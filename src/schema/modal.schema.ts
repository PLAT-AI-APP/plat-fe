import { z } from "zod";
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

export const personaFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, FIELD_ERROR_MESSAGES.personaNameRequired)
    .max(20, FIELD_ERROR_MESSAGES.personaNameMaxLength),
  info: z
    .string()
    .trim()
    .max(200, FIELD_ERROR_MESSAGES.personaInfoMaxLength),
});

export type PersonaFormValues = z.input<typeof personaFormSchema>;
