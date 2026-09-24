"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  type FileUploadType,
  useFileUploadMutation,
} from "@/api/file/postFileUpload";
import { getCropOutputType } from "@/lib/cropImage";
import { showAppToast } from "@/lib/toast";
import { CharacterCreateFormValues } from "@/schema/character.schema";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// 업로드 API 제한에 맞춰 5MB 이하 파일만 크롭 단계로 넘깁니다.
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type ImageField = "representativeImage" | "characterProfileImage";
type ImageIdField = "representativeImageId" | "characterProfileImageId";

interface UseCroppedImageUploadParams {
  imageField: ImageField;
  idField: ImageIdField;
  fileType: FileUploadType;
  /** 업로드할 파일 이름(확장자 제외) */
  fileBaseName: string;
  invalidTypeMessage: string;
  invalidSizeMessage: string;
}

interface CropTarget {
  src: string;
  type: string;
}

const isBlobUrl = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("blob:");

const formOptions = { shouldDirty: true, shouldValidate: true } as const;

/**
 * 이미지 고르기 → 크롭 → 업로드 흐름(대표 이미지·캐릭터 프로필 이미지 공용).
 *
 * 예전에는 "적용"을 누르면 크롭 결과를 올릴 때까지 모달이 닫히지 않았고, 버튼만 회색이 된 채
 * 기다려야 했다. 이제 크롭 결과를 바로 미리보기에 넣고 모달을 닫은 뒤, 업로드는 뒤에서 한다.
 * 업로드가 끝나야 fileId 가 채워지므로 그동안은 isUploading 으로 썸네일에 대기 표시를 하고,
 * 등록·임시저장은 CreateHeader 가 막는다. 실패하면 앞 이미지로 되돌린다(토스트는 전역).
 *
 * 미리보기는 base64 대신 object URL 을 쓴다. 파일을 통째로 문자열로 읽지 않아 빠르다.
 * (다른 탭의 미리보기도 같은 주소를 쓰므로 언마운트 때 해제하지 않고, 교체·삭제 때만 해제한다.)
 */
export const useCroppedImageUpload = ({
  imageField,
  idField,
  fileType,
  fileBaseName,
  invalidTypeMessage,
  invalidSizeMessage,
}: UseCroppedImageUploadParams) => {
  const { setValue, getValues } = useFormContext<CharacterCreateFormValues>();
  const { mutateAsync: uploadFile } = useFileUploadMutation();
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // 업로드 중에 새 이미지를 고르거나 지우면 앞 업로드의 결과는 버린다.
  const uploadSequenceRef = useRef(0);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showAppToast("warning", invalidTypeMessage);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      showAppToast("warning", invalidSizeMessage);
      return;
    }

    setCropTarget({ src: URL.createObjectURL(file), type: file.type });
  };

  const closeCrop = () => {
    if (cropTarget) URL.revokeObjectURL(cropTarget.src);
    setCropTarget(null);
  };

  const handleCropApply = async (blob: Blob) => {
    if (!cropTarget) return;

    const outputType = getCropOutputType(cropTarget.type);
    const previousImage = getValues(imageField);
    const previousId = getValues(idField);
    const previewUrl = URL.createObjectURL(blob);

    setValue(imageField, previewUrl, formOptions);
    setValue(idField, null, formOptions);
    closeCrop();

    const sequence = ++uploadSequenceRef.current;
    setIsUploading(true);

    try {
      // 파일 이름의 확장자를 실제 인코딩 형식에 맞춘다(예전에는 webp 입력을 jpeg 로 뽑고 .webp 로 올렸다).
      const extension = outputType === "image/png" ? "png" : "jpg";
      const file = new File([blob], `${fileBaseName}.${extension}`, {
        type: outputType,
      });
      const uploaded = await uploadFile({ fileType, file });
      if (sequence !== uploadSequenceRef.current) return;

      setValue(idField, uploaded.fileId, formOptions);
      if (isBlobUrl(previousImage)) URL.revokeObjectURL(previousImage);
    } catch (error) {
      if (sequence !== uploadSequenceRef.current) return;
      // 실패 토스트는 MutationCache 의 전역 에러 처리가 띄운다. 화면은 앞 이미지로 되돌린다.
      console.error(`${fileBaseName} upload failed:`, error);
      setValue(imageField, previousImage, formOptions);
      setValue(idField, previousId, formOptions);
      URL.revokeObjectURL(previewUrl);
    } finally {
      if (sequence === uploadSequenceRef.current) setIsUploading(false);
    }
  };

  const handleDelete = () => {
    uploadSequenceRef.current += 1;
    setIsUploading(false);

    const currentImage = getValues(imageField);
    setValue(imageField, "", formOptions);
    setValue(idField, null, formOptions);
    if (isBlobUrl(currentImage)) URL.revokeObjectURL(currentImage);
  };

  return {
    cropTarget,
    isUploading,
    handleImageChange,
    handleCropApply,
    closeCrop,
    handleDelete,
  };
};
