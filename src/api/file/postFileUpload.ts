import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export type FileUploadId = string;

export type FileUploadType =
  "USER_PROFILE" | "CHARACTER_PROFILE" | "UNIVERSE_PROFILE" | "UNIVERSE_ASSET";

export interface FileUploadResponse {
  fileId: FileUploadId;
  imageType: FileUploadType;
}

export interface PostFileUploadParams {
  fileType: FileUploadType;
  file: File;
}

const createFileUploadFormData = (file: File) => {
  // 업로드 API는 multipart/form-data의 image 필드만 요구하므로 payload 생성을 한 곳에서 관리합니다.
  const formData = new FormData();
  formData.append("image", file);

  return formData;
};

export const postFileUpload = async ({
  fileType,
  file,
}: PostFileUploadParams) => {
  // imageType은 Path Variable이므로 /files/images/{imageType} 형태로 전달합니다.
  const response = await authAxios.post<FileUploadResponse>(
    `/files/images/${fileType}`,
    createFileUploadFormData(file),
  );

  const uploadedFile = response.data;

  // 업로드 성공 응답에 fileId가 없으면 이후 생성 API에 잘못된 값을 넘기므로 여기서 먼저 중단합니다.
  if (!uploadedFile?.fileId) {
    throw new Error("File upload response does not include fileId.");
  }

  return uploadedFile;
};

/** 이미지 파일을 TEMP 상태로 업로드하고 후속 API에 전달할 fileId를 발급받습니다. */
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
