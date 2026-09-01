import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";
import type { UniverseCreateRequest } from "@/api/universe/postUniverseCreate";
import type { UniverseDetailResponse } from "@/api/universe/getUniverseDetail";
import type { UniverseUpdateRequest } from "@/api/universe/patchUniverseUpdate";

const ALLOWED_ASSET_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_ASSET_IMAGE_SIZE = 5 * 1024 * 1024;
const deletedUniverseIds = new Set<string>();
const mockUniverseDetails = new Map<string, UniverseDetailResponse>();

const isUniverseMissing = (universeId?: string): universeId is undefined =>
  !universeId || universeId === "999" || deletedUniverseIds.has(universeId);

const createMockUniverseAssetImageUploadResponse = () => {
  return {
    fileId: crypto.randomUUID(),
    imageType: "ASSET",
  };
};

const parseUniverseCreateRequest = async (requestPart: FormDataEntryValue) => {
  const requestText =
    requestPart instanceof File ? await requestPart.text() : requestPart;

  return JSON.parse(requestText) as UniverseCreateRequest;
};

const parseUniverseUpdateRequest = async (requestPart: FormDataEntryValue) => {
  const requestText =
    requestPart instanceof File ? await requestPart.text() : requestPart;

  return JSON.parse(requestText) as UniverseUpdateRequest;
};

const validateImagePart = (
  file: FormDataEntryValue | null,
  fieldName: string,
) => {
  if (!(file instanceof File)) {
    return `${fieldName} is required.`;
  }

  if (!ALLOWED_ASSET_IMAGE_TYPES.includes(file.type)) {
    return `${fieldName} must be a JPG, PNG, or WEBP image.`;
  }

  if (file.size > MAX_ASSET_IMAGE_SIZE) {
    return `${fieldName} can be uploaded up to 5MiB.`;
  }

  return null;
};

const validateOptionalImagePart = (
  file: FormDataEntryValue | null,
  fieldName: string,
) => {
  if (!file) return null;
  if (file instanceof File && file.size === 0) return null;

  return validateImagePart(file, fieldName);
};

const createMockUniverseDetail = (
  universeId: string,
): UniverseDetailResponse => ({
  universeId,
  visibility: "PUBLIC",
  commentEnabled: true,
  tendency: "MALE_ORIENTED",
  category: "ROMANCE",
  chatCount: 12,
  likeCount: 3,
  title: "당신을 기다려온 소꿉친구",
  introduce: "밝고 명랑하지만 수줍음이 많은 당신의 오랜 친구입니다.",
  detailSetting: "매주 목요일마다 카페에서 당신을 기다립니다.",
  description: "소꿉친구 연우와 대화하는 로맨스 세계관입니다.",
  profileImageUrl: "https://picsum.photos/seed/universe-profile/640/640",
  characterName: "연우",
  characterProfileUrl: "https://picsum.photos/seed/character-profile/320/320",
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
      episodeNo: 1,
      name: "기본 시나리오",
      content: "문이 열리자 연우는 놀란 표정으로 고개를 들었다.",
    },
  ],
});

const getMockUniverseDetail = (universeId: string) =>
  mockUniverseDetails.get(universeId) ?? createMockUniverseDetail(universeId);

const toDetailTendency = (tendency: UniverseUpdateRequest["tendency"]) => {
  if (tendency === "MALE") return "MALE_ORIENTED";
  if (tendency === "FEMALE") return "FEMALE_ORIENTED";

  return tendency;
};

const createMockImageUrl = (fieldName: string, universeId: string) =>
  `https://picsum.photos/seed/${fieldName}-${universeId}-${Date.now()}/640/640`;

const createUpdatedUniverseDetail = (
  universeId: string,
  current: UniverseDetailResponse,
  body: UniverseUpdateRequest,
  profileImage: FormDataEntryValue | null,
  characterProfileImage: FormDataEntryValue | null,
): UniverseDetailResponse => ({
  ...current,
  visibility: body.visibility ?? current.visibility,
  commentEnabled: body.commentEnabled ?? current.commentEnabled,
  tendency: toDetailTendency(body.tendency) ?? current.tendency,
  category: body.category ?? current.category,
  title: body.title ?? current.title,
  introduce: body.introduce ?? current.introduce,
  detailSetting: body.detailSetting ?? current.detailSetting,
  description: body.description ?? current.description,
  characterName: body.name ?? current.characterName,
  profileImageUrl:
    profileImage instanceof File && profileImage.size > 0
      ? createMockImageUrl("universe-profile", universeId)
      : current.profileImageUrl,
  characterProfileUrl:
    characterProfileImage instanceof File && characterProfileImage.size > 0
      ? createMockImageUrl("character-profile", universeId)
      : current.characterProfileUrl,
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
          episodeNo: index + 1,
          name: scenario.name,
          content: scenario.content,
        })),
});

export const universeHandlers = [
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

    const formData = await request.formData();
    const requestPart = formData.get("request");
    const profileImage = formData.get("profileImage");
    const characterProfileImage = formData.get("characterProfileImage");

    if (!requestPart) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_REQUEST_REQUIRED",
          message: "Universe update request is required.",
          fields: {
            request: "Universe update request is required.",
          },
        },
        { status: 400 },
      );
    }

    let body: UniverseUpdateRequest;
    try {
      body = await parseUniverseUpdateRequest(requestPart);
    } catch {
      return HttpResponse.json(
        {
          code: "UNIVERSE_REQUEST_INVALID",
          message: "Universe update request must be valid JSON.",
          fields: {
            request: "Universe update request must be valid JSON.",
          },
        },
        { status: 400 },
      );
    }

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

    const profileImageError = validateOptionalImagePart(
      profileImage,
      "profileImage",
    );
    const characterProfileImageError = validateOptionalImagePart(
      characterProfileImage,
      "characterProfileImage",
    );

    if (profileImageError || characterProfileImageError) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_IMAGE_INVALID",
          message: profileImageError || characterProfileImageError,
          fields: {
            ...(profileImageError ? { profileImage: profileImageError } : {}),
            ...(characterProfileImageError
              ? { characterProfileImage: characterProfileImageError }
              : {}),
          },
        },
        { status: 400 },
      );
    }

    const current = getMockUniverseDetail(universeId);
    mockUniverseDetails.set(
      universeId,
      createUpdatedUniverseDetail(
        universeId,
        current,
        body,
        profileImage,
        characterProfileImage,
      ),
    );

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(endpoint("/universe/assets/images"), async ({ request }) => {
    const formData = await request.formData();
    const assetImage = formData.get("assetImage");

    if (!(assetImage instanceof File)) {
      return HttpResponse.json(
        {
          code: "ASSET_IMAGE_REQUIRED",
          message: "Please select an asset image file.",
          fields: {
            assetImage: "Please select an asset image file.",
          },
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_ASSET_IMAGE_TYPES.includes(assetImage.type)) {
      return HttpResponse.json(
        {
          code: "ASSET_IMAGE_TYPE_INVALID",
          message: "Only JPG, PNG, and WEBP image files can be uploaded.",
          fields: {
            assetImage: "Only JPG, PNG, and WEBP image files can be uploaded.",
          },
        },
        { status: 400 },
      );
    }

    if (assetImage.size > MAX_ASSET_IMAGE_SIZE) {
      return HttpResponse.json(
        {
          code: "ASSET_IMAGE_SIZE_EXCEEDED",
          message: "Asset images can be uploaded up to 5MiB.",
          fields: {
            assetImage: "Asset images can be uploaded up to 5MiB.",
          },
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(createMockUniverseAssetImageUploadResponse());
  }),

  http.post(endpoint("/universe"), async ({ request }) => {
    const formData = await request.formData();
    const requestPart = formData.get("request");
    const profileImage = formData.get("profileImage");
    const characterProfileImage = formData.get("characterProfileImage");

    if (!requestPart) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_REQUEST_REQUIRED",
          message: "Universe create request is required.",
          fields: {
            request: "Universe create request is required.",
          },
        },
        { status: 400 },
      );
    }

    let body: UniverseCreateRequest;
    try {
      body = await parseUniverseCreateRequest(requestPart);
    } catch {
      return HttpResponse.json(
        {
          code: "UNIVERSE_REQUEST_INVALID",
          message: "Universe create request must be valid JSON.",
          fields: {
            request: "Universe create request must be valid JSON.",
          },
        },
        { status: 400 },
      );
    }

    const profileImageError = validateImagePart(profileImage, "profileImage");
    const characterProfileImageError = validateImagePart(
      characterProfileImage,
      "characterProfileImage",
    );

    if (profileImageError || characterProfileImageError) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_IMAGE_INVALID",
          message: profileImageError || characterProfileImageError,
          fields: {
            ...(profileImageError ? { profileImage: profileImageError } : {}),
            ...(characterProfileImageError
              ? { characterProfileImage: characterProfileImageError }
              : {}),
          },
        },
        { status: 400 },
      );
    }

    if (!body.title || !body.name || !body.detailSetting || !body.introduce) {
      return HttpResponse.json(
        {
          code: "UNIVERSE_REQUIRED_FIELD_MISSING",
          message: "Required universe fields are missing.",
          fields: {
            ...(!body.title ? { title: "title is required." } : {}),
            ...(!body.name ? { name: "name is required." } : {}),
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
        characterId: crypto.randomUUID(),
      },
      { status: 201 },
    );
  }),
];
