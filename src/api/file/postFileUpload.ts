import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

export type FileUploadId = string | number;

export type FileUploadType =
  | "USER_PROFILE"
  | "CHARACTER_PROFILE"
  | "CHARACTER_ASSET"
  | "UNIVERSE_PROFILE";

export interface FileUploadResponse {
  originalFileId: FileUploadId;
  mdFileId: FileUploadId;
  smFileId: FileUploadId;
  originalUrl: string;
  mdUrl: string;
  smUrl: string;
  expiredAt: string;
  assetCode: string | null;
}

export interface PostFileUploadParams {
  fileType: FileUploadType;
  file: File;
}

const createFileUploadFormData = (file: File) => {
  // 업로드 API는 multipart/form-data의 file 필드만 요구하므로 payload 생성을 한 곳에서 관리합니다.
  const formData = new FormData();
  formData.append("file", file);

  return formData;
};

export const postFileUpload = async ({
  fileType,
  file,
}: PostFileUploadParams) => {
  // 문서상 fileType은 Path Variable이므로 /files/upload/{fileType} 형태로 전달합니다.
  const response = await authAxios.post<ApiSuccessResponse<FileUploadResponse>>(
    `/files/upload/${fileType}`,
    createFileUploadFormData(file),
  );

  console.log("/files/upload response:", response.data);

  const uploadedFile = response.data.data;

  // 업로드 성공 응답에 fileId가 없으면 이후 생성 API에 잘못된 값을 넘기므로 여기서 먼저 중단합니다.
  if (!uploadedFile?.originalFileId) {
    throw new Error("File upload response does not include originalFileId.");
  }

  return uploadedFile;
};

/** 이미지 파일을 TEMP 상태로 업로드하고 후속 API에 전달할 fileId와 URL을 발급받습니다. */
export const useFileUploadMutation = () => {
  return useMutation<
    FileUploadResponse,
    AppError<PostFileUploadParams>,
    PostFileUploadParams
  >({
    mutationKey: ["post-file-upload"],
    mutationFn: postFileUpload,
  });
};
