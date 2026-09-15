import { useMutation } from "@tanstack/react-query";
import { AppError } from "@/type/api";
import { FileUploadResponse, postFileUpload } from "@/api/file/postFileUpload";

export interface PostUniverseAssetImageUploadParams {
  assetImageFile: File;
}

// 세계관 에셋 이미지도 공용 임시 업로드 API(UNIVERSE_ASSET)를 그대로 사용합니다.
export const postUniverseAssetImage = ({
  assetImageFile,
}: PostUniverseAssetImageUploadParams): Promise<FileUploadResponse> =>
  postFileUpload({ fileType: "UNIVERSE_ASSET", file: assetImageFile });

export const useUniverseAssetImageUploadMutation = () => {
  return useMutation<
    FileUploadResponse,
    AppError<PostUniverseAssetImageUploadParams>,
    PostUniverseAssetImageUploadParams
  >({
    mutationKey: ["post-universe-asset-image"],
    mutationFn: postUniverseAssetImage,
  });
};
