import { z } from "zod";

/** 캐릭터 생성 form의 유효성 검사 */
export const characterCreateSchema = z.object({
  representativeImage: z.string().min(1, "대표 이미지를 등록해주세요."),
  title: z.string().min(1, "타이틀을 입력해주세요."),
  name: z.string().min(1, "이름을 입력해주세요."),
  characterIntroduce: z.string().min(1, "캐릭터 소개를 입력해주세요."),
  characterDetailSetting: z.string().min(1, "캐릭터 상세 설정을 입력해주세요."),
  asset: z
    .array(
      z.object({
        assetFile: z.any().nullable(),
        assetImage: z.string(),
        assetName: z.string().min(1, "에셋 이름을 입력해주세요."),
        assetSituation: z.string().min(1, "에셋 상황을 입력해주세요."),
      }),
    )
    .optional(),
  scenarios: z.array(
    z.object({
      name: z.string().min(1, "시나리오 이름을 입력해주세요."),
      contents: z.array(
        z.object({
          id: z.string(),
          type: z.enum(["chat", "action", "asset"]),
          value: z.string().min(1, "내용을 입력해주세요."),
        }),
      ),
    }),
  ),
  isPublic: z.boolean(),
  characterDescription: z.string(),
  tendency: z.string(),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  tagIds: z.array(
    z.object({
      id: z.number(),
      label: z.string(),
    }),
  ),
});
