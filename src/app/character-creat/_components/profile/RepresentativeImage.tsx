"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { Close, ImageIcon } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";

const RepresentativeImage = () => {
  const t = useTranslations("characterCreate.representativeImage");
  const { setValue, getValues } = useFormContext<CharacterCreateFormValues>();
  const preview = getValues("representativeImage");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert(t("invalidType"));
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(t("invalidSize"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("representativeImage", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const previewRemove = () => {
    setValue("representativeImage", "");
  };

  return (
    <section>
      <header className="flex flex-col gap-1 pb-5.25">
        <div className="title-3 flex items-center gap-1">
          <span>{t("label")}</span>
          <span className="text-font-accents">*</span>
        </div>
        <p className="body-5 text-font-2">{t("guide")}</p>
      </header>

      <div id="image-upload-wrapper" className="flex w-fit flex-col gap-2">
        <input
          id="image"
          className="hidden"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.jfif"
          onChange={handleImageChange}
        />

        <label
          htmlFor="image"
          className="flex h-30 w-30 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-card"
        >
          {preview ? (
            <Image
              src={preview}
              alt={t("previewAlt")}
              width={120}
              height={120}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-7.5 w-7.5 text-font-disabled" />
          )}
        </label>

        <div className="flex h-9 gap-1">
          <label
            htmlFor="image"
            className="body-4 flex w-full flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-xl border border-border-main bg-bg-darkest py-2 text-center"
          >
            {t("upload")}
          </label>
          {preview && (
            <button
              onClick={previewRemove}
              type="button"
              className="flex w-9 items-center justify-center rounded-xl border border-[#FF383C] bg-[#FF383C]/10"
            >
              <Close className="h-4 w-4 text-font-accents" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default RepresentativeImage;
