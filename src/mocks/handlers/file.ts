import { http, HttpResponse } from "msw";
import type { FileUploadType } from "@/api/file/postFileUpload";

const fileUploadTypes: FileUploadType[] = [
  "USER_PROFILE",
  "CHARACTER_PROFILE",
  "CHARACTER_ASSET",
  "UNIVERSE_PROFILE",
];

const getUploadedFileExtension = (file: File) => {
  // MSW 응답 URL은 실제 스토리지 저장이 없으므로 업로드 파일명을 참고해 확장자만 보존합니다.
  const extension = file.name.split(".").pop()?.toLowerCase();

  return extension || "webp";
};

const createMockFileUploadResponse = (
  fileType: FileUploadType,
  file: File,
) => {
  const baseId = Date.now();
  const fileId = crypto.randomUUID();
  const extension = getUploadedFileExtension(file);
  const filePathPrefix = fileType.toLowerCase().replaceAll("_", "/");

  return {
    originalFileId: baseId,
    mdFileId: baseId + 1,
    smFileId: baseId + 2,
    originalUrl: `/files/${filePathPrefix}/${fileId}.${extension}`,
    mdUrl: `/files/${filePathPrefix}/${fileId}_md.${extension}`,
    smUrl: `/files/${filePathPrefix}/${fileId}_sm.${extension}`,
    expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assetCode: fileType === "CHARACTER_ASSET" ? `asset-${fileId}` : null,
  };
};

export const fileHandlers = [
  http.post(
    /\/files\/upload\/([^/]+)(?:\?.*)?$/,
    async ({ request, params }) => {
      const fileType = params[0] as FileUploadType;

      if (!fileUploadTypes.includes(fileType)) {
        return HttpResponse.json(
          {
            code: "FILE_TYPE_INVALID",
            message: "지원하지 않는 파일 업로드 유형입니다.",
          },
          { status: 400 },
        );
      }

      const formData = await request.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return HttpResponse.json(
          {
            code: "FILE_EMPTY",
            message: "업로드할 이미지 파일을 선택해 주세요.",
            fields: {
              file: "파일을 선택해 주세요.",
            },
          },
          { status: 400 },
        );
      }

      return HttpResponse.json(createMockFileUploadResponse(fileType, file));
    },
  ),
];
