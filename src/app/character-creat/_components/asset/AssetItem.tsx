"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Draggable } from "@hello-pangea/dnd";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import CopyFill from "@/icons/CopyFill";
import { ArrowDown, Dots, ImageIcon, Trash } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";

interface AssetItemProps {
  id: string;
  index: number;
  remove: (index: number) => void;
  copyAsset: (index: number) => void;
}

const AssetItem = ({ id, index, remove, copyAsset }: AssetItemProps) => {
  const t = useTranslations("characterCreate.asset");
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CharacterCreateFormValues>();
  const [isActive, setIsActive] = useState(false);
  const assetImage = useWatch({ control, name: `asset.${index}.assetImage` });
  const assetName = useWatch({ control, name: `asset.${index}.assetName` });
  const assetSituation = useWatch({
    control,
    name: `asset.${index}.assetSituation`,
  });
  const currentAssetError = errors.asset?.[index];

  const toggleActive = () => setIsActive((prev) => !prev);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert(t("invalidType"));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(t("invalidSize"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(`asset.${index}.assetImage`, reader.result as string, {
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="rounded-xl border border-border-main bg-bg-darkest p-2.5 pt-0.75"
        >
          <div
            {...provided.dragHandleProps}
            className="mb-0.75 flex h-3 cursor-grab items-center justify-center pb-0.75 active:cursor-grabbing"
          >
            <Dots className="w-5.75 text-font-disabled" />
          </div>

          <article className="flex justify-between">
            <div className="flex gap-2.5">
              <label
                htmlFor={`asset-image-${index}`}
                className="relative flex h-15 w-15 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-card"
              >
                {assetImage ? (
                  <Image
                    src={typeof assetImage === "string" ? assetImage : ""}
                    alt={t("imageAlt")}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6 text-font-disabled" />
                )}
                <input
                  id={`asset-image-${index}`}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                />
              </label>

              <p className="body-4 flex gap-1">
                {assetName || t("defaultName")}
                <span className="text-font-disabled">#3Eabde</span>
              </p>
            </div>

            <div className="flex gap-2 text-font-2">
              <button
                type="button"
                onClick={() => copyAsset(index)}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-card"
              >
                <CopyFill className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-card"
              >
                <Trash className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={toggleActive}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:bg-card ${
                  isActive ? "rotate-180" : ""
                }`}
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </article>

          {isActive && (
            <div className="mt-4 flex flex-col gap-4">
              <SmartInput
                {...register(`asset.${index}.assetName` as const)}
                label={t("nameLabel")}
                required
                placeholder={t("namePlaceholder")}
                maxLength={15}
                placeholderClassName="placeholder:text-font-2"
                counterClassName="text-font-disabled"
                value={assetName}
                labelFontSize="title-5"
                error={currentAssetError?.assetName?.message}
              />
              <SmartInput
                {...register(`asset.${index}.assetSituation` as const)}
                label={t("situationLabel")}
                type="textarea"
                required
                placeholder={t("situationPlaceholder")}
                maxLength={50}
                placeholderClassName="placeholder:text-font-2"
                counterClassName="text-font-disabled"
                maxLine={3}
                minLine={3}
                description={t("situationHelp")}
                value={assetSituation}
                labelFontSize="title-5"
                descFontSize="body-6"
                error={currentAssetError?.assetSituation?.message}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default AssetItem;
