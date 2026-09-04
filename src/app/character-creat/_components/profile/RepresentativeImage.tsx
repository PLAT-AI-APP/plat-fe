"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { Close, ImageIcon, Plus } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import RepresentativeImageCropModal from "./RepresentativeImageCropModal";
import { cn } from "@/lib/utils";
import { showAppToast } from "@/lib/toast";

const RepresentativeImage = () => {
  const t = useTranslations("characterCreate.representativeImage");
  const { setValue, control } = useFormContext<CharacterCreateFormValues>();
  const preview = useWatch({ control, name: "representativeImage" });
  const [cropTarget, setCropTarget] = useState<{
    src: string;
    type: string;
  } | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showAppToast("warning", t("invalidType"));
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showAppToast("warning", t("invalidSize"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") return;

      // 업로드 직후에는 바로 저장하지 않고, 크롭 모달에서 확정된 결과만 반영합니다.
      setCropTarget({
        src: reader.result,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 크롭 결과는 폼에만 담고, 실제 파일 전송은 세계관 생성 multipart 요청이 맡습니다.
  const handleCropApply = (croppedImage: string) => {
    if (!cropTarget) return;

    setValue("representativeImage", croppedImage, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCropTarget(null);
  };

  const handlePreviewDelete = () => {
    setValue("representativeImage", "");
    setValue("representativeImageId", null);
  };

  return (
    <section>
      <header className="flex flex-col gap-1 pb-3">
        <div className="title-3 flex items-center gap-1">
          <span>{t("label")}</span>
          <span className="text-font-accents">*</span>
        </div>
        <p className="body-5 text-font-2">{t("guide")}</p>
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
          <div className="relative flex aspect-square w-[120px] h-[157px] items-center justify-center rounded-xl bg-card">
            {preview ? (
              <Image
                src={preview}
                alt={t("previewAlt")}
                width={120}
                height={157}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-7.5 w-7.5 text-font-disabled" />
            )}

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
          onClose={() => setCropTarget(null)}
        />
      )}
    </section>
  );
};

export default RepresentativeImage;
