import { z } from "zod";
import { FIELD_ERROR_MESSAGES } from "@/constants/fieldMessages";

// 파일 업로드 ID는 백엔드 직렬화 정책에 따라 숫자 또는 문자열로 올 수 있어 두 타입을 모두 허용합니다.
const fileUploadIdSchema = z.union([z.number(), z.string()]);

/** 시나리오 난이도. 자유 서술 대신 정해진 네 단계 중 하나를 고릅니다. */
export const SCENARIO_DIFFICULTY_LEVELS = [
  "EASY",
  "NORMAL",
  "HARD",
  "VERY_HARD",
] as const;
export type ScenarioDifficulty = (typeof SCENARIO_DIFFICULTY_LEVELS)[number];

/** 캐릭터 생성 form의 필수값과 입력 제한을 한 곳에서 검증합니다. */
export const characterCreateSchema = z.object({
  representativeImage: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.representativeImageRequired),
  representativeImageId: fileUploadIdSchema.nullable(),
  characterProfileImage: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterProfileImageRequired),
  characterProfileImageId: fileUploadIdSchema.nullable(),
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
        assetImageFileId: fileUploadIdSchema.nullable(),
        assetName: z
          .string()
          .min(1, FIELD_ERROR_MESSAGES.assetNameRequired)
          .max(15, FIELD_ERROR_MESSAGES.assetNameMaxLength),
        assetSituation: z
          .string()
          .min(1, FIELD_ERROR_MESSAGES.assetSituationRequired)
          .max(50, FIELD_ERROR_MESSAGES.assetSituationMaxLength),
        assetVisibility: z.enum(["PUBLIC", "PRIVATE"]),
      }),
    )
    .max(50, FIELD_ERROR_MESSAGES.assetMaxCount)
    .optional(),

  scenarios: z
    .array(
      z.object({
        name: z.string().min(1, FIELD_ERROR_MESSAGES.scenarioNameRequired),
        // 시나리오 설명은 선택 입력값이지만 저장 전 최대 길이는 스키마에서 함께 검증합니다.
        description: z
          .string()
          .max(100, FIELD_ERROR_MESSAGES.scenarioDescriptionMaxLength),
        // 시나리오 난이도는 네 단계 중 하나를 고르는 값이라 기본값(NORMAL)이 항상 있습니다.
        difficulty: z.enum(SCENARIO_DIFFICULTY_LEVELS),
        contents: z.array(
          z.object({
            id: z.string(),
            type: z.enum(["chat", "userChat", "action", "asset"]),
            value: z
              .string()
              .min(1, FIELD_ERROR_MESSAGES.scenarioContentRequired)
              .max(1500, FIELD_ERROR_MESSAGES.scenarioContentMaxLength),
            // asset 타입만 갖는 값. value는 미리보기 표시용 이미지(base64/URL)라
            // 그대로 백엔드에 보낼 수 없어, 임시 업로드 API가 내려준 식별자를 따로 들고 다닌다.
            assetImageFileId: fileUploadIdSchema.nullable().optional(),
          }),
        ),
      }),
    )
    .max(5, FIELD_ERROR_MESSAGES.scenarioMaxCount),

  isPublic: z.boolean(),
  allowComments: z.boolean(),
  characterDescription: z
    .string()
    .min(1, FIELD_ERROR_MESSAGES.characterDescriptionRequired)
    .max(1000, FIELD_ERROR_MESSAGES.characterDescriptionMaxLength),

  tendency: z.string().min(1, FIELD_ERROR_MESSAGES.tendencyRequired),
  category: z.array(z.string()).min(1, FIELD_ERROR_MESSAGES.categoryRequired),
  tagIds: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    )
    .min(1, FIELD_ERROR_MESSAGES.tagRequired)
    .max(5, FIELD_ERROR_MESSAGES.tagMaxCount),
});

export type CharacterCreateFormValues = z.input<typeof characterCreateSchema>;
