import { http, HttpResponse } from "msw";
import type { FileUploadType } from "@/api/file/postFileUpload";

const fileUploadTypes: FileUploadType[] = [
  "USER_PROFILE",
  "CHARACTER_PROFILE",
  "UNIVERSE_PROFILE",
  "UNIVERSE_ASSET",
];

const createMockFileUploadResponse = (fileType: FileUploadType) => ({
  fileId: crypto.randomUUID(),
  imageType: fileType,
});

export const fileHandlers = [
  http.post(
    /\/files\/images\/([^/]+)(?:\?.*)?$/,
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
      const image = formData.get("image");

      if (!(image instanceof File)) {
        return HttpResponse.json(
          {
            code: "FILE_EMPTY",
            message: "업로드할 이미지 파일을 선택해 주세요.",
            fields: {
              image: "파일을 선택해 주세요.",
            },
          },
          { status: 400 },
        );
      }

      return HttpResponse.json(createMockFileUploadResponse(fileType), {
        status: 201,
      });
    },
  ),
];
