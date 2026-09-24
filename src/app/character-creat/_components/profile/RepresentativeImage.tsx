"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { Close, ImageIcon, Plus } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { cn } from "@/lib/utils";
import { useCroppedImageUpload } from "./useCroppedImageUpload";

const RepresentativeImageCropModal = dynamic(
  () => import("./RepresentativeImageCropModal"),
  { ssr: false },
);

const RepresentativeImage = () => {
  const t = useTranslations("characterCreate.representativeImage");
  const { control } = useFormContext<CharacterCreateFormValues>();
  const preview = useWatch({ control, name: "representativeImage" });
  const uploadingLabel = t("uploading");
  const {
    cropTarget,
    isUploading,
    handleImageChange,
    handleCropApply,
    closeCrop,
    handleDelete: handlePreviewDelete,
  } = useCroppedImageUpload({
    imageField: "representativeImage",
    idField: "representativeImageId",
    fileType: "UNIVERSE_PROFILE",
    fileBaseName: "representative-image",
    invalidTypeMessage: t("invalidType"),
    invalidSizeMessage: t("invalidSize"),
  });

  return (
    <section>
      <header className="flex flex-col gap-1 pb-3">
        <div className="title-3 flex items-center gap-1">
          <span>{t("label")}</span>
          <span className="text-font-accents">*</span>
        </div>
        <p className="body-6 text-font-2">{t("guide")}</p>
      </header>

      <div
        id="image-upload-wrapper"
        className="mt-3 flex h-[175px] w-[138px] flex-col justify-end"
      >
        <input
          id="representative-image"
          className="hidden"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.jfif"
          onChange={handleImageChange}
        />

        <label
          id="representative-image-field"
          htmlFor="representative-image"
          tabIndex={-1}
          className="group relative flex justify-end w-[120px] h-full cursor-pointer flex-col gap-0 rounded-xl"
        >
          {/* 안내 문구가 말하는 대로 1:1.13 이다. aspect-square 는 w/h 에 덮여 아무 일도 하지 않으면서 정사각형처럼 읽혔다. */}
          <div className="relative flex h-[157px] w-[120px] items-center justify-center rounded-xl bg-card">
            <div className="relative flex size-full items-center justify-center overflow-hidden rounded-xl">
              {preview ? (
                <Image
                  src={preview}
                  alt={t("previewAlt")}
                  width={120}
                  height={157}
                  unoptimized
                  className="h-full w-full object-cover"
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
                preview && "text-font-error bg-danger-bg",
              )}
            >
              {preview ? (
                <Close className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
            </span>
          </div>
        </label>
      </div>

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

export default RepresentativeImage;
