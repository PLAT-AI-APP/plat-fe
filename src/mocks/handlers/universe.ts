import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";

const ALLOWED_ASSET_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_ASSET_IMAGE_SIZE = 5 * 1024 * 1024;

const createMockUniverseAssetImageUploadResponse = () => {
  return {
    fileId: crypto.randomUUID(),
    imageType: "ASSET",
  };
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
];
