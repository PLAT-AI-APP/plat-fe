import { z } from "zod";

/** 캐릭터 생성 form의 유효성 검사 */
export const characterCreateSchema = z.object({
  representativeImage: z.string().min(1, "대표 이미지를 등록해주세요."),
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(20, "제목은 최대 20자까지 입력 가능해요"),
  name: z
    .string()
    .min(1, "캐릭터 이름을 입력해주세요.")
    .max(20, "캐릭터 이름은 최대 20자까지 입력 가능해요"),
  characterIntroduce: z
    .string()
    .min(1, "캐릭터 소개를 입력해주세요.")
    .max(30, "캐릭터 소개는 최대 30자까지 입력 가능해요"),

  characterDetailSetting: z
    .string()
    .min(1, "캐릭터 상세 설정을 입력해주세요.")
    .max(2000, "상세 설정은 최대 2000자까지 입력 가능해요"),

  asset: z
    .array(
      z.object({
        assetFile: z.any().nullable(),
        assetImage: z.string(),
        assetName: z
          .string()
          .min(1, "에셋 이름을 입력해주세요.")
          .max(15, "에셋 이름은 최대 15자까지 입력 가능해요"),
        assetSituation: z
          .string()
          .min(1, "에셋 상황을 입력해주세요.")
          .max(50, "상황 설명은 최대 50자까지 입력 가능해요"),
      }),
    )
    .max(50, "에셋은 최대 50개까지만 등록 가능합니다.")
    .optional(),

  scenarios: z
    .array(
      z.object({
        name: z.string().min(1, "시나리오 이름을 입력해주세요."),
        contents: z.array(
          z.object({
            id: z.string(),
            type: z.enum(["chat", "action", "asset"]),
            value: z
              .string()
              .min(1, "내용을 입력해주세요.")
              .max(1500, "내용은 최대 1500자까지 입력 가능해요"),
          }),
        ),
      }),
    )
    .max(5, "시나리오는 최대 5개까지 생성할 수 있습니다."),

  isPublic: z.boolean(),
  characterDescription: z
    .string()
    .min(1, "캐릭터 설명을 입력해주세요.")
    .max(1000, "캐릭터 설명은 최대 1000자까지 입력 가능해요"),

  tendency: z.string().min(1, "성향을 선택해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  tagIds: z
    .array(
      z.object({
        id: z.number(),
        label: z.string(),
      }),
    )
    .max(5, "태그는 최대 5개까지만 등록 가능합니다."),
});

export type CharacterCreateFormValues = z.input<typeof characterCreateSchema>;
