import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";
import type { UniverseCreateRequest } from "@/api/universe/postUniverseCreate";
import type { UniverseDetailResponse } from "@/api/universe/getUniverseDetail";
import type { UniverseUpdateRequest } from "@/api/universe/patchUniverseUpdate";

const deletedUniverseIds = new Set<string>();
const mockUniverseDetails = new Map<string, UniverseDetailResponse>();

const isUniverseMissing = (universeId?: string): universeId is undefined =>
  !universeId || universeId === "999" || deletedUniverseIds.has(universeId);

const createMockUniverseDetail = (
  universeId: string,
): UniverseDetailResponse => ({
  universeId,
  creatorId: "1234567890123456789",
  editable: true,
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
      content: "문이 열리자 연우는 놀란 표정으로 고개를 들었다.",
    },
  ],
});

const getMockUniverseDetail = (universeId: string) =>
  mockUniverseDetails.get(universeId) ?? createMockUniverseDetail(universeId);

const universeNotFound = () =>
  HttpResponse.json(
    { code: "UNIVERSE_NOT_FOUND", message: "Universe does not exist." },
    { status: 404 },
  );

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

    const body = (await request.json()) as UniverseUpdateRequest;

    if (!body.language) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_LANGUAGE_REQUIRED",
          message: "language is required.",
          fields: {
            language: "language is required.",
          },
        },
        { status: 400 },
      );
    }

    const current = getMockUniverseDetail(universeId);
    mockUniverseDetails.set(
      universeId,
      createUpdatedUniverseDetail(universeId, current, body),
    );

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(endpoint("/universe"), async ({ request }) => {
    const body = (await request.json()) as UniverseCreateRequest;

    if (
      !body.title ||
      !body.character?.name ||
      !body.detailSetting ||
      !body.introduce ||
      !body.profileImageFileId ||
      !body.character?.profileImageFileId
    ) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_REQUIRED_FIELD_MISSING",
          message: "Required universe fields are missing.",
          fields: {
            ...(!body.title ? { title: "title is required." } : {}),
            ...(!body.character?.name ? { name: "name is required." } : {}),
            ...(!body.detailSetting
              ? { detailSetting: "detailSetting is required." }
              : {}),
            ...(!body.introduce ? { introduce: "introduce is required." } : {}),
          },
        },
        { status: 400 },
      );
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
