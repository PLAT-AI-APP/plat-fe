"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useFileUploadMutation } from "@/api/file/postFileUpload";
import { Close, ImageIcon, Plus } from "@/icons";
import { dataUrlToFile } from "@/lib/file";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import RepresentativeImageCropModal from "../../profile/RepresentativeImageCropModal";
import { cn } from "@/lib/utils";
import { showAppToast } from "@/lib/toast";

// 상세정보 프로필 이미지는 백엔드 업로드 정책과 동일하게 웹 이미지 포맷만 허용합니다.
const ALLOWED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// 피그마 안내와 업로드 API 제한에 맞춰 5MB 이하 파일만 크롭 단계로 넘깁니다.
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const CharacterProfileImage = () => {
  const t = useTranslations("characterCreate.details");
  const representativeT = useTranslations("characterCreate.representativeImage");
  const { setValue, control } = useFormContext<CharacterCreateFormValues>();
  const preview = useWatch({ control, name: "characterProfileImage" });
  const { mutateAsync: uploadFile } = useFileUploadMutation();
  const [cropTarget, setCropTarget] = useState<{
    src: string;
    type: string;
  } | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      showAppToast("warning", representativeT("invalidType"));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      showAppToast("warning", representativeT("invalidSize"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") return;

      // 선택한 이미지는 크롭 모달에서 확정한 뒤 RHF 값으로 반영합니다.
      setCropTarget({
        src: reader.result,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropApply = async (croppedImage: string) => {
    if (!cropTarget) return;

    try {
      const croppedFile = await dataUrlToFile(
        croppedImage,
        `character-profile-image.${cropTarget.type.split("/")[1] || "webp"}`,
        cropTarget.type,
      );
      const uploadedImage = await uploadFile({
        fileType: "CHARACTER_PROFILE",
        file: croppedFile,
      });

      setValue("characterProfileImage", croppedImage, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("characterProfileImageId", uploadedImage.originalFileId, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setCropTarget(null);
    } catch (error) {
      // 실패 토스트는 axios 인터셉터 → MutationCache의 전역 에러 처리에서 이미 띄우므로 여기서 중복으로 띄우지 않습니다.
      console.error("Character profile image upload failed:", error);
    }
  };

  const handlePreviewDelete = () => {
    setValue("characterProfileImage", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("characterProfileImageId", null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="title-3 flex items-center gap-1">
        <span>{t("profileImageLabel")}</span>
        <span className="text-font-accents">*</span>
      </div>

      <input
        id="character-profile-image"
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.jfif"
        onChange={handleImageChange}
      />

      <label
        htmlFor="character-profile-image"
        className="group relative flex size-32 cursor-pointer items-center justify-center overflow-visible rounded-xl bg-card"
      >
        <div className="relative flex size-full items-center justify-center overflow-hidden rounded-xl">
          {preview ? (
            <Image
              src={preview}
              alt={t("profileImagePreviewAlt")}
              width={128}
              height={128}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="h-7.5 w-7.5 text-font-disabled" />
          )}
        </div>

        <span
          onClick={(e) => {
            if (!preview) return;

            e.preventDefault();
            e.stopPropagation();

            handlePreviewDelete();
          }}
          className={cn(
            "absolute right-0 top-0 flex size-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-brand/10 text-brand backdrop-blur-[2px] transition-transform group-hover:scale-105",
            preview && "bg-danger-bg text-font-error",
          )}
        >
          {preview ? (
            <Close className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
        </span>
      </label>

      {cropTarget && (
        <RepresentativeImageCropModal
          imageSrc={cropTarget.src}
          imageType={cropTarget.type}
          onApply={handleCropApply}
          onClose={() => setCropTarget(null)}
        />
      )}
    </section>
  );
};

export default CharacterProfileImage;
