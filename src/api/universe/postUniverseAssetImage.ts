import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { FileUploadId } from "@/api/file/postFileUpload";
import { AppError } from "@/type/api";

export interface UniverseAssetImageUploadResponse {
  fileId: FileUploadId;
  imageType: "ASSET";
}

export interface PostUniverseAssetImageUploadParams {
  assetImageFile: File;
}

const createUniverseAssetImageFormData = (assetImageFile: File) => {
  const formData = new FormData();
  formData.append("assetImage", assetImageFile);

  return formData;
};

export const postUniverseAssetImage = async ({
  assetImageFile,
}: PostUniverseAssetImageUploadParams): Promise<UniverseAssetImageUploadResponse> => {
  const response = await authAxios.post<UniverseAssetImageUploadResponse>(
    "/universe/assets/images",
    createUniverseAssetImageFormData(assetImageFile),
  );

  const uploadedImage = response.data;

  if (!uploadedImage?.fileId) {
    throw new Error(
      "Universe asset image upload response does not include fileId.",
    );
  }

  return uploadedImage;
};

export const useUniverseAssetImageUploadMutation = () => {
  return useMutation<
    UniverseAssetImageUploadResponse,
    AppError<PostUniverseAssetImageUploadParams>,
    PostUniverseAssetImageUploadParams
  >({
    mutationKey: ["post-universe-asset-image"],
    mutationFn: postUniverseAssetImage,
  });
};
