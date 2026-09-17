import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";
import type { UniverseCreateRequest } from "@/api/universe/postUniverseCreate";
import type { UniverseDetailResponse } from "@/api/universe/getUniverseDetail";
import type { UniverseUpdateRequest } from "@/api/universe/patchUniverseUpdate";

const deletedUniverseIds = new Set<string>();
const mockUniverseDetails = new Map<string, UniverseDetailResponse>();

const isUniverseMissing = (universeId?: string): universeId is undefined =>
  !universeId || universeId === "999" || deletedUniverseIds.has(universeId);

/**
 * 관례상 이 id는 "내 세계관이 아님"을 재현한다 — 999(존재하지 않음)와 같은 방식의 고정 테스트 id.
 * 백엔드는 UniverseService.assertOwner에서 제작자 본인이 아니면 UNIVERSE_ACCESS_DENIED(403)를 던진다.
 */
const FORBIDDEN_UNIVERSE_ID = "403";

const createMockUniverseDetail = (
  universeId: string,
): UniverseDetailResponse => ({
  universeId,
  creatorId: "1234567890123456789",
  creatorUserId: "1234567890123456789",
  creatorName: "흐물거리는달팽이",
  creatorFollowerCount: 24,
  editable: universeId !== FORBIDDEN_UNIVERSE_ID,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  visibility: "PUBLIC",
  commentEnabled: true,
  tendency: "MALE_ORIENTED",
  category: "ROMANCE",
  chatCount: 12,
  likeCount: 3,
  liked: false,
  title: "당신을 기다려온 소꿉친구",
  introduce: "밝고 명랑하지만 수줍음이 많은 당신의 오랜 친구입니다.",
  detailSetting: "매주 목요일마다 카페에서 당신을 기다립니다.",
  description: "소꿉친구 연우와 대화하는 로맨스 세계관입니다.",
  profileImageUrl: "https://picsum.photos/seed/universe-profile/640/640",
  character: {
    universeCharacterId: "9876543210987654321",
    name: "연우",
    description: "밝고 다정하지만 가끔 엉뚱한 소꿉친구입니다.",
    detailSetting: "매주 목요일마다 카페에서 당신을 기다립니다.",
    profileImageUrl: "https://picsum.photos/seed/character-profile/320/320",
  },
  hashtags: [
    {
      hashtagId: "11",
      label: "소꿉친구",
    },
  ],
  assets: [
    {
      assetImageFileId: "456789012345678901",
      assetName: "행복",
      assetSituation: "행복한 감정을 느낄 때 표시합니다.",
      originalUrl: "https://picsum.photos/seed/universe-asset-happy/640/384",
    },
  ],
  scenarios: [
    {
      scenarioId: "1",
      episodeNo: 1,
      displayOrder: 1,
      name: "기본 시나리오",
      description: "입학식 날 처음 마주치는 장면입니다.",
      content: "문이 열리자 연우는 놀란 표정으로 고개를 들었다.",
    },
  ],
});

/** comment.ts 등 다른 핸들러도 세계관 소유권(editable)·댓글 사용 여부를 참조할 수 있도록 export한다. */
export const getMockUniverseDetail = (universeId: string) =>
  mockUniverseDetails.get(universeId) ?? createMockUniverseDetail(universeId);

const universeNotFound = () =>
  HttpResponse.json(
    { code: "UNIVERSE_NOT_FOUND", message: "Universe does not exist." },
    { status: 404 },
  );

/** UniverseService.assertOwner와 동일 — 제작자가 아니면 수정·삭제할 수 없다. */
const universeAccessDenied = () =>
  HttpResponse.json(
    {
      code: "UNIVERSE_ACCESS_DENIED",
      message: "세계관을 수정할 권한이 없습니다.",
    },
    { status: 403 },
  );

const invalidInput = (fields: Record<string, string>) =>
  HttpResponse.json(
    {
      code: "INVALID_INPUT",
      message: "요청 값이 올바르지 않습니다.",
      fields,
    },
    { status: 400 },
  );

const assetNameDuplicated = () =>
  HttpResponse.json(
    {
      code: "UNIVERSE_ASSET_NAME_DUPLICATED",
      message: "에셋 이름이 중복되었습니다.",
    },
    { status: 409 },
  );

const hashtagInvalid = () =>
  HttpResponse.json(
    {
      code: "HASHTAG_INVALID",
      message: "선택한 해시태그가 올바르지 않습니다.",
    },
    { status: 400 },
  );

/** UniverseService.validateAssetNames와 동일 — 에셋 이름은 같은 요청 안에서 중복될 수 없다. */
const hasDuplicateAssetNames = (names: string[]) =>
  new Set(names).size !== names.length;

/** UniverseService.validateTagIds와 동일 — 태그 id가 중복되면 안 된다. */
const hasDuplicateTagIds = (tagIds: string[]) =>
  new Set(tagIds).size !== tagIds.length;

/** 서버와 같이 멱등입니다. 이미 그 상태면 카운트를 건드리지 않습니다. */
const setUniverseLiked = (universeId: string, liked: boolean) => {
  const current = getMockUniverseDetail(universeId);

  mockUniverseDetails.set(universeId, {
    ...current,
    liked,
    likeCount:
      current.liked === liked
        ? current.likeCount
        : Math.max(current.likeCount + (liked ? 1 : -1), 0),
  });
};

const createMockImageUrl = (fieldName: string, universeId: string) =>
  `https://picsum.photos/seed/${fieldName}-${universeId}-${Date.now()}/640/640`;

const createUpdatedUniverseDetail = (
  universeId: string,
  current: UniverseDetailResponse,
  body: UniverseUpdateRequest,
): UniverseDetailResponse => ({
  ...current,
  updatedAt: new Date().toISOString(),
  visibility: body.visibility ?? current.visibility,
  commentEnabled: body.commentEnabled ?? current.commentEnabled,
  tendency: body.tendency ?? current.tendency,
  category: body.category ?? current.category,
  title: body.title ?? current.title,
  introduce: body.introduce ?? current.introduce,
  detailSetting: body.detailSetting ?? current.detailSetting,
  description: body.description ?? current.description,
  profileImageUrl: body.profileImageFileId
    ? createMockImageUrl("universe-profile", universeId)
    : current.profileImageUrl,
  character: {
    ...current.character,
    name: body.character?.name ?? current.character.name,
    description: body.character?.description ?? current.character.description,
    detailSetting:
      body.character?.detailSetting ?? current.character.detailSetting,
    profileImageUrl: body.character?.profileImageFileId
      ? createMockImageUrl("character-profile", universeId)
      : current.character.profileImageUrl,
  },
  hashtags:
    body.tagIds == null
      ? current.hashtags
      : body.tagIds.map((tagId) => ({
          hashtagId: tagId,
          label: tagId === "11" ? "소꿉친구" : `태그 ${tagId}`,
        })),
  assets:
    body.assets == null
      ? current.assets
      : body.assets.map((asset) => ({
          assetImageFileId: asset.assetImageFileId,
          assetName: asset.assetName,
          assetSituation: asset.assetSituation,
          originalUrl:
            current.assets.find(
              (currentAsset) =>
                currentAsset.assetImageFileId === asset.assetImageFileId,
            )?.originalUrl ??
            `https://picsum.photos/seed/universe-asset-${asset.assetImageFileId}/640/384`,
        })),
  scenarios:
    body.scenarios == null
      ? current.scenarios
      : body.scenarios.map((scenario, index) => ({
          scenarioId: String(index + 1),
          episodeNo: index + 1,
          displayOrder: index + 1,
          name: scenario.name,
          description: scenario.description,
          content: scenario.content,
        })),
});

export const universeHandlers = [
  http.post(/\/universe\/([^/]+)\/like$/, ({ request }) => {
    const universeId = pathValue(request.url, /\/universe\/([^/]+)\/like$/);

    if (isUniverseMissing(universeId)) {
      return universeNotFound();
    }

    setUniverseLiked(universeId, true);
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/universe\/([^/]+)\/like$/, ({ request }) => {
    const universeId = pathValue(request.url, /\/universe\/([^/]+)\/like$/);

    // 취소는 노출 여부를 보지 않는 서버 동작을 그대로 흉내 냅니다.
    if (!universeId) {
      return universeNotFound();
    }

    setUniverseLiked(universeId, false);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(/\/universe\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const universeId = pathValue(request.url, /\/universe\/([^/]+)$/);

    if (isUniverseMissing(universeId)) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_NOT_FOUND",
          message: "Universe does not exist.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(getMockUniverseDetail(universeId));
  }),

  http.delete(/\/universe\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const universeId = pathValue(request.url, /\/universe\/([^/]+)$/);

    if (!universeId || universeId === "999") {
      return HttpResponse.json(
        {
          code: "UNIVERSE_NOT_FOUND",
          message: "Universe does not exist.",
        },
        { status: 404 },
      );
    }

    // assertOwner: 제작자 본인이 아니면 삭제할 수 없다.
    if (!getMockUniverseDetail(universeId).editable) {
      return universeAccessDenied();
    }

    deletedUniverseIds.add(universeId);

    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(/\/universe\/([^/]+)(?:\?.*)?$/, async ({ request }) => {
    const universeId = pathValue(request.url, /\/universe\/([^/]+)$/);

    if (isUniverseMissing(universeId)) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_NOT_FOUND",
          message: "Universe does not exist.",
        },
        { status: 404 },
      );
    }

    // assertOwner: 제작자 본인이 아니면 수정할 수 없다.
    const current = getMockUniverseDetail(universeId);
    if (!current.editable) {
      return universeAccessDenied();
    }

    const body = (await request.json()) as UniverseUpdateRequest;

    // PatchUniverseRequest는 language만 @NotNull — 나머지는 생략 시 기존 값 유지다.
    if (!body.language) {
      return invalidInput({ language: "언어를 선택해 주세요." });
    }

    if (body.assets && hasDuplicateAssetNames(body.assets.map((a) => a.assetName))) {
      return assetNameDuplicated();
    }

    if (body.tagIds && hasDuplicateTagIds(body.tagIds)) {
      return hashtagInvalid();
    }

    mockUniverseDetails.set(
      universeId,
      createUpdatedUniverseDetail(universeId, current, body),
    );

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(endpoint("/universe"), async ({ request }) => {
    const body = (await request.json()) as UniverseCreateRequest;

    // PostUniverseRequest: title/introduce/detailSetting/description/character 필드/profileImageFileId는 @NotBlank·@NotNull,
    // scenarios·tagIds는 @NotEmpty.
    const fields: Record<string, string> = {};
    if (!body.title) fields.title = "제목을 입력해 주세요.";
    if (!body.introduce) fields.introduce = "한 줄 소개를 입력해 주세요.";
    if (!body.detailSetting) fields.detailSetting = "상세 설정을 입력해 주세요.";
    if (!body.description) fields.description = "설명을 입력해 주세요.";
    if (!body.scenarios || body.scenarios.length === 0)
      fields.scenarios = "시나리오를 1개 이상 입력해 주세요.";
    if (!body.tagIds || body.tagIds.length === 0)
      fields.tagIds = "해시태그를 1개 이상 선택해 주세요.";
    if (!body.profileImageFileId)
      fields.profileImageFileId = "대표 이미지를 업로드해 주세요.";
    if (!body.character?.name) fields["character.name"] = "캐릭터 이름을 입력해 주세요.";
    if (!body.character?.description)
      fields["character.description"] = "캐릭터 설명을 입력해 주세요.";
    if (!body.character?.detailSetting)
      fields["character.detailSetting"] = "캐릭터 상세 설정을 입력해 주세요.";
    if (!body.character?.profileImageFileId)
      fields["character.profileImageFileId"] = "캐릭터 프로필 이미지를 업로드해 주세요.";

    if (Object.keys(fields).length > 0) {
      return invalidInput(fields);
    }

    if (hasDuplicateAssetNames((body.assets ?? []).map((a) => a.assetName))) {
      return assetNameDuplicated();
    }

    if (hasDuplicateTagIds(body.tagIds)) {
      return hashtagInvalid();
    }

    return HttpResponse.json(
      {
        universeId: crypto.randomUUID(),
        universeCharacterId: crypto.randomUUID(),
      },
      { status: 201 },
    );
  }),
];
