import { z } from "zod";
import { FIELD_ERROR_MESSAGES } from "@/constants/fieldMessages";

/** 캐릭터 생성 form의 필수값과 입력 제한을 한 곳에서 검증합니다. */
export const characterCreateSchema = z.object({
  representativeImage: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.representativeImageRequired),
  characterProfileImage: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterProfileImageRequired),
  title: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterTitleRequired)
    .max(20, FIELD_ERROR_MESSAGES.characterTitleMaxLength),
  name: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterNameRequired)
    .max(20, FIELD_ERROR_MESSAGES.characterNameMaxLength),
  characterIntroduce: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterIntroduceRequired)
    .max(20, FIELD_ERROR_MESSAGES.characterIntroduceMaxLength),
  // 프롤로그 소개는 긴 도입부 설명을 받을 수 있어 한 줄 소개와 별도 길이로 검증합니다.
  profileSituationDescription: z
    .string()
    .max(2000, FIELD_ERROR_MESSAGES.profileSituationMaxLength),

  characterDetailSetting: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterDetailSettingRequired)
    .max(2000, FIELD_ERROR_MESSAGES.characterDetailSettingMaxLength),

  asset: z
    .array(
      z.object({
        assetFile: z.any().nullable(),
        assetImage: z.string(),
        assetName: z
          .string()
          .min(1, FIELD_ERROR_MESSAGES.assetNameRequired)
          .max(15, FIELD_ERROR_MESSAGES.assetNameMaxLength),
        assetSituation: z
          .string()
          .min(1, FIELD_ERROR_MESSAGES.assetSituationRequired)
          .max(50, FIELD_ERROR_MESSAGES.assetSituationMaxLength),
      }),
    )
    .max(50, FIELD_ERROR_MESSAGES.assetMaxCount)
    .optional(),

  scenarios: z
    .array(
      z.object({
        name: z.string().min(1, FIELD_ERROR_MESSAGES.scenarioNameRequired),
        contents: z.array(
          z.object({
            id: z.string(),
            type: z.enum(["chat", "userChat", "action", "asset"]),
            value: z
              .string()
              .min(1, FIELD_ERROR_MESSAGES.scenarioContentRequired)
              .max(1500, FIELD_ERROR_MESSAGES.scenarioContentMaxLength),
          }),
        ),
      }),
    )
    .max(5, FIELD_ERROR_MESSAGES.scenarioMaxCount),

  isPublic: z.boolean(),
  characterDescription: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterDescriptionRequired)
    .max(1000, FIELD_ERROR_MESSAGES.characterDescriptionMaxLength),

  tendency: z.string().min(1, FIELD_ERROR_MESSAGES.tendencyRequired),
  category: z.array(z.string()).min(1, FIELD_ERROR_MESSAGES.categoryRequired),
  tagIds: z
    .array(
      z.object({
        id: z.number(),
        label: z.string(),
      }),
    )
    .max(5, FIELD_ERROR_MESSAGES.tagMaxCount),
});

export type CharacterCreateFormValues = z.input<typeof characterCreateSchema>;
