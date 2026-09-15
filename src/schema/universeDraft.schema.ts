import { z } from "zod";
import { getResourceImageUrl } from "@/lib/file";
import { createSchemaMigrator, SchemaMigrationStep } from "@/lib/schemaMigration";
import { CharacterCreateFormValues } from "@/schema/character.schema";

/** fileId는 백엔드 직렬화 정책상 숫자 또는 문자열로 올 수 있어 문자열로 정규화합니다. */
const fileIdSchema = z
  .union([z.string(), z.number()])
  .nullable()
  .catch(null)
  .transform((value) => (value == null ? null : String(value)));

const draftScenarioContentSchema = z.object({
  id: z.string().catch(() => `restored-${Math.random().toString(36).slice(2)}`),
  type: z.enum(["chat", "userChat", "action", "asset"]).catch("action"),
  value: z.string().catch(""),
  assetImageFileId: fileIdSchema,
});

const draftScenarioSchema = z.object({
  name: z.string().catch(""),
  description: z.string().catch(""),
  contents: z.array(draftScenarioContentSchema).catch([]),
});

const draftAssetSchema = z.object({
  assetImageFileId: fileIdSchema,
  assetName: z.string().catch(""),
  assetSituation: z.string().catch(""),
  assetVisibility: z.enum(["PUBLIC", "PRIVATE"]).catch("PUBLIC"),
});

const draftTagSchema = z.object({
  id: z.string().catch(""),
  label: z.string().catch(""),
});

/**
 * 캐릭터 생성 폼의 임시저장 데이터 v1. 백엔드 /drafts에는 type: "UNIVERSE"로 저장되며,
 * payload(자유 형식 JSON, 최대 256KiB)로 그대로 전송됩니다.
 * 미리보기용 base64(assetImage 등)는 용량만 잡아먹고 fileId로 얼마든지 다시 만들 수 있어 담지 않습니다.
 *
 * payload는 백엔드가 내부 구조를 전혀 검증하지 않는 자유 형식 JSON이라(DraftPayloadValidator는
 * 객체인지·용량만 봅니다), API로 직접 만든 테스트 데이터 등 프론트가 모르는 모양이 얼마든지 올 수
 * 있습니다. 필드마다 .catch()로 기본값을 둬서, 무엇이 오든 파싱 자체는 절대 실패하지 않게 합니다.
 */
export const universeDraftV1Schema = z.object({
  schemaVersion: z.literal(1).catch(1),
  title: z.string().catch(""),
  name: z.string().catch(""),
  characterIntroduce: z.string().catch(""),
  profileSituationDescription: z.string().catch(""),
  characterDetailSetting: z.string().catch(""),
  characterDescription: z.string().catch(""),
  isPublic: z.boolean().catch(true),
  allowComments: z.boolean().catch(true),
  tendency: z.string().catch(""),
  category: z.array(z.string()).catch([]),
  tagIds: z.array(draftTagSchema).catch([]),
  representativeImageFileId: fileIdSchema,
  characterProfileImageFileId: fileIdSchema,
  asset: z.array(draftAssetSchema).catch([]),
  scenarios: z.array(draftScenarioSchema).catch([]),
});

export type UniverseDraftV1 = z.infer<typeof universeDraftV1Schema>;

/** 필드 단위 .catch()로도 못 잡는 경우(최상위 값 자체가 객체가 아닌 경우)의 마지막 안전망입니다. */
const EMPTY_UNIVERSE_DRAFT = universeDraftV1Schema.parse({});

/**
 * 서버에서 받아온 draft.payload(타입이 unknown인 자유 형식 JSON)를 UniverseDraftV1로 안전하게
 * 변환합니다. 필드가 없거나 모양이 다르면 각 필드의 기본값으로 채워질 뿐, 절대 throw하지 않습니다
 * — 여기서 막지 않으면 reset() 이후 렌더링 단계에서 형태를 예상 못 한 값이 컴포넌트를 깨뜨립니다.
 * (최상위 값 자체가 객체가 아니면 필드별 .catch()가 적용될 대상이 없어 그때만 빈 초안으로 대체합니다.)
 *
 * 주의: v2가 추가되면 이 함수도 payload.schemaVersion을 보고 맞는 버전 스키마로 파싱하도록
 * 바뀌어야 합니다. 지금처럼 v1 스키마로 고정 파싱하면 v2 payload가 와도 v1로 강등되어
 * migrateUniverseDraft가 이미 최신인 데이터를 다시 마이그레이션하면서 값이 유실됩니다.
 */
export const sanitizeUniverseDraft = (payload: unknown): UniverseDraftV1 => {
  const result = universeDraftV1Schema.safeParse(payload ?? {});
  return result.success ? result.data : EMPTY_UNIVERSE_DRAFT;
};

/** 지금까지 존재했던 모든 버전의 임시저장 데이터 */
export type AnyUniverseDraft = UniverseDraftV1;

/** 서비스가 현재 사용하는 최신 임시저장 스키마 */
export type LatestUniverseDraft = UniverseDraftV1;

// 아직 v1뿐이라 비어 있습니다. v2가 생기면 [v1 -> v2 변환 함수]를 여기 추가하면 됩니다.
const universeDraftMigrations: SchemaMigrationStep[] = [];

/** 서버에서 받아온 payload(과거 버전일 수 있음)를 최신 스키마로 변환합니다. */
export const migrateUniverseDraft = createSchemaMigrator<
  LatestUniverseDraft,
  AnyUniverseDraft
>(universeDraftMigrations);

const toFileId = (value: string | number | null | undefined): string | null =>
  value == null ? null : String(value);

/** 캐릭터 생성 폼의 현재 값을 임시저장 payload로 직렬화합니다. */
export const buildUniverseDraft = (
  values: CharacterCreateFormValues,
): UniverseDraftV1 => ({
  schemaVersion: 1,
  title: values.title,
  name: values.name,
  characterIntroduce: values.characterIntroduce,
  profileSituationDescription: values.profileSituationDescription,
  characterDetailSetting: values.characterDetailSetting,
  characterDescription: values.characterDescription,
  isPublic: values.isPublic,
  allowComments: values.allowComments,
  tendency: values.tendency,
  category: values.category,
  tagIds: values.tagIds,
  representativeImageFileId: toFileId(values.representativeImageId),
  characterProfileImageFileId: toFileId(values.characterProfileImageId),
  asset: (values.asset ?? []).map((asset) => ({
    assetImageFileId: toFileId(asset.assetImageFileId),
    assetName: asset.assetName,
    assetSituation: asset.assetSituation,
    assetVisibility: asset.assetVisibility,
  })),
  scenarios: values.scenarios.map((scenario) => ({
    name: scenario.name,
    description: scenario.description,
    contents: (scenario.contents ?? []).map((content) => ({
      id: content.id,
      type: content.type,
      // asset의 원본 value(base64 미리보기)는 용량만 크고 fileId로 복원 가능해 담지 않습니다.
      value: content.type === "asset" ? "" : content.value,
      assetImageFileId: toFileId(content.assetImageFileId),
    })),
  })),
});

/** 이 draft가 참조하는 모든 fileId. 초안 생성/수정 요청의 최상위 fileIds로 그대로 실어 보냅니다. */
export const collectUniverseDraftFileIds = (
  draft: UniverseDraftV1,
): string[] => {
  const ids = [
    draft.representativeImageFileId,
    draft.characterProfileImageFileId,
    ...draft.asset.map((asset) => asset.assetImageFileId),
    ...draft.scenarios.flatMap((scenario) =>
      scenario.contents.map((content) => content.assetImageFileId),
    ),
  ].filter((id): id is string => Boolean(id));

  return Array.from(new Set(ids));
};

/** 서버에서 불러온 draft를 캐릭터 생성 폼이 바로 reset()에 쓸 수 있는 값으로 되돌립니다. */
export const applyUniverseDraft = (
  draft: UniverseDraftV1,
  defaultScenarioName: string,
): Partial<CharacterCreateFormValues> => ({
  title: draft.title ?? "",
  name: draft.name ?? "",
  characterIntroduce: draft.characterIntroduce ?? "",
  profileSituationDescription: draft.profileSituationDescription ?? "",
  characterDetailSetting: draft.characterDetailSetting ?? "",
  characterDescription: draft.characterDescription ?? "",
  isPublic: draft.isPublic ?? true,
  allowComments: draft.allowComments ?? true,
  tendency: draft.tendency ?? "",
  category: draft.category ?? [],
  tagIds: draft.tagIds ?? [],
  representativeImage: draft.representativeImageFileId
    ? getResourceImageUrl(draft.representativeImageFileId, "UNIVERSE_PROFILE")
    : "",
  representativeImageId: draft.representativeImageFileId,
  characterProfileImage: draft.characterProfileImageFileId
    ? getResourceImageUrl(draft.characterProfileImageFileId, "CHARACTER_PROFILE")
    : "",
  characterProfileImageId: draft.characterProfileImageFileId,
  asset: (draft.asset ?? []).map((asset) => ({
    assetFile: null,
    assetImage: asset.assetImageFileId
      ? getResourceImageUrl(asset.assetImageFileId, "UNIVERSE_ASSET")
      : "",
    assetImageFileId: asset.assetImageFileId,
    assetName: asset.assetName,
    assetSituation: asset.assetSituation,
    assetVisibility: asset.assetVisibility ?? "PUBLIC",
  })),
  scenarios:
    draft.scenarios && draft.scenarios.length > 0
      ? draft.scenarios.map((scenario) => ({
          name: scenario.name,
          description: scenario.description ?? "",
          contents: (scenario.contents ?? []).map((content) => ({
            id: content.id,
            type: content.type,
            value:
              content.type === "asset" && content.assetImageFileId
                ? getResourceImageUrl(content.assetImageFileId, "UNIVERSE_ASSET")
                : content.value,
            assetImageFileId: content.assetImageFileId,
          })),
        }))
      : [
          {
            name: defaultScenarioName,
            description: "",
            contents: [],
          },
        ],
});
