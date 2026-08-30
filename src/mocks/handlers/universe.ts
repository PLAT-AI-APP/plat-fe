import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { UniverseCreateRequest } from "@/api/universe/postUniverseCreate";

const ALLOWED_ASSET_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_ASSET_IMAGE_SIZE = 5 * 1024 * 1024;

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

export const universeHandlers = [
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

    return HttpResponse.json(
      createMockUniverseAssetImageUploadResponse(),
    );
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
