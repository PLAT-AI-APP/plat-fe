import { http, HttpResponse } from "msw";
import type { FileUploadType } from "@/api/file/postFileUpload";

const fileUploadTypes: FileUploadType[] = [
  "USER_PROFILE",
  "CHARACTER_PROFILE",
  "UNIVERSE_PROFILE",
  "UNIVERSE_ASSET",
];

// 실서버 MultipartFileUtil.ALLOWED_EXTENSIONS와 동일합니다.
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

// 실서버 FileTypePolicy는 타입별 최대 크기를 따로 두지만, 지금 프론트가 올리는 네 타입은
// 전부 5MB로 같아서 목업에서는 하나로 통일합니다.
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const extractExtension = (filename: string) => {
  const dotIndex = filename.lastIndexOf(".");

  return dotIndex === -1 ? "" : filename.slice(dotIndex + 1).toLowerCase();
};

const createMockFileUploadResponse = (fileType: FileUploadType) => ({
  fileId: crypto.randomUUID(),
  imageType: fileType,
});

export const fileHandlers = [
  http.post(
    /\/files\/images\/([^/]+)(?:\?.*)?$/,
    async ({ request, params }) => {
      const fileType = params[0] as FileUploadType;

      // Path Variable이 ImageUploadType enum으로 바인딩 안 되면 FileTypeConverter가
      // InputValidationException(FILE_TYPE_INVALID)로 끊습니다.
      if (!fileUploadTypes.includes(fileType)) {
        return HttpResponse.json(
          { code: "FILE_TYPE_INVALID", message: "파일 타입이 올바르지 않습니다." },
          { status: 400 },
        );
      }

      const formData = await request.formData();
      const image = formData.get("image");

      // MultipartFileUtil.validate 순서(비어있음 → 확장자 → 크기)를 그대로 따릅니다.
      if (!(image instanceof File) || image.size === 0) {
        return HttpResponse.json(
          { code: "FILE_EMPTY", message: "파일을 선택해주세요." },
          { status: 400 },
        );
      }

      const extension = extractExtension(image.name);
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return HttpResponse.json(
          {
            code: "FILE_EXTENSION_UNSUPPORTED",
            message: "jpg, png, webp 형식만 업로드할 수 있습니다.",
          },
          { status: 400 },
        );
      }

      if (image.size > MAX_FILE_SIZE_BYTES) {
        return HttpResponse.json(
          {
            code: "FILE_SIZE_EXCEEDED",
            message: "파일 크기가 제한을 초과했습니다.",
          },
          // DomainErrorCode.FILE_SIZE_EXCEEDED는 PAYLOAD_TOO_LARGE 카테고리라 413입니다.
          { status: 413 },
        );
      }

      return HttpResponse.json(createMockFileUploadResponse(fileType), {
        status: 201,
      });
    },
  ),
];
