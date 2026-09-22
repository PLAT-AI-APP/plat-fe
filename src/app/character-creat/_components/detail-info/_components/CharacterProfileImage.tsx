"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { Close, ImageIcon, Plus } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { cn } from "@/lib/utils";
import { useCroppedImageUpload } from "../../profile/useCroppedImageUpload";

const RepresentativeImageCropModal = dynamic(
  () => import("../../profile/RepresentativeImageCropModal"),
  { ssr: false },
);

const CharacterProfileImage = () => {
  const t = useTranslations("characterCreate.details");
  const representativeT = useTranslations(
    "characterCreate.representativeImage",
  );
  const { control } = useFormContext<CharacterCreateFormValues>();
  const preview = useWatch({ control, name: "characterProfileImage" });
  const uploadingLabel = representativeT("uploading");
  const {
    cropTarget,
    isUploading,
    handleImageChange,
    handleCropApply,
    closeCrop,
    handleDelete: handlePreviewDelete,
  } = useCroppedImageUpload({
    imageField: "characterProfileImage",
    idField: "characterProfileImageId",
    fileType: "CHARACTER_PROFILE",
    fileBaseName: "character-profile-image",
    invalidTypeMessage: representativeT("invalidType"),
    invalidSizeMessage: representativeT("invalidSize"),
  });

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
        id="character-profile-image-field"
        htmlFor="character-profile-image"
        tabIndex={-1}
        className="group relative flex size-32 cursor-pointer items-center justify-center overflow-visible rounded-xl bg-card"
      >
        <div className="relative flex size-full items-center justify-center overflow-hidden rounded-xl">
          {preview ? (
            <Image
              src={preview}
              alt={t("profileImagePreviewAlt")}
              width={128}
              height={128}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="h-7.5 w-7.5 text-font-disabled" />
          )}
          {isUploading && (
            // 미리보기는 이미 바뀌었고 업로드만 뒤에서 이어진다. 끝날 때까지 등록은 막힌다.
            <span
              role="status"
              aria-label={uploadingLabel}
              className="absolute inset-0 flex items-center justify-center bg-scrim/40"
            >
              <span
                aria-hidden="true"
                className="size-6 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            </span>
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
          {preview ? <Close className="size-4" /> : <Plus className="size-4" />}
        </span>
      </label>

      {cropTarget && (
        <RepresentativeImageCropModal
          imageSrc={cropTarget.src}
          imageType={cropTarget.type}
          onApply={handleCropApply}
          onClose={closeCrop}
        />
      )}
    </section>
  );
};

export default CharacterProfileImage;
