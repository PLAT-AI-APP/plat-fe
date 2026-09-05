"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Draggable } from "@hello-pangea/dnd";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { useUniverseAssetImageUploadMutation } from "@/api/universe/postUniverseAssetImage";
import {
  ArrowDown,
  Dots,
  ImageIcon,
  LockLine,
  Trash,
  UnlockLine,
} from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { showAppToast } from "@/lib/toast";

interface AssetItemProps {
  id: string;
  index: number;
  remove: (index: number) => void;
}

const AssetItem = ({ id, index, remove }: AssetItemProps) => {
  const t = useTranslations("characterCreate.asset");
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CharacterCreateFormValues>();
  const [isActive, setIsActive] = useState(false);
  const { mutateAsync: uploadAssetImage } =
    useUniverseAssetImageUploadMutation();
  const assetImage = useWatch({ control, name: `asset.${index}.assetImage` });
  const assetName = useWatch({ control, name: `asset.${index}.assetName` });
  const assetSituation = useWatch({
    control,
    name: `asset.${index}.assetSituation`,
  });
  const assetVisibility =
    useWatch({
      control,
      name: `asset.${index}.assetVisibility`,
    }) ?? "PUBLIC";
  const currentAssetError = errors.asset?.[index];
  // 카드 헤더에는 입력 중인 에셋명을 즉시 반영하고, 비어 있으면 기본 이름을 보여줍니다.
  const displayAssetName = assetName || t("defaultName");

  const toggleActive = () => setIsActive((prev) => !prev);
  const isPublicAsset = assetVisibility === "PUBLIC";

  // 공개 상태는 에셋별 RHF 값으로 저장해 생성 API payload까지 그대로 전달합니다.
  const toggleAssetVisibility = () => {
    setValue(
      `asset.${index}.assetVisibility`,
      isPublicAsset ? "PRIVATE" : "PUBLIC",
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

    try {
      const uploadedImage = await uploadAssetImage({
        assetImageFile: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue(`asset.${index}.assetImage`, reader.result as string, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue(`asset.${index}.assetImageFileId`, uploadedImage.fileId, {
          shouldDirty: true,
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      // 실패 토스트는 axios 인터셉터 → MutationCache의 전역 에러 처리에서 이미 띄우므로 여기서 중복으로 띄우지 않습니다.
      console.error("Asset image upload failed:", error);
    }

    e.target.value = "";
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`min-h-[110px] overflow-hidden rounded-xl border border-main bg-darkest px-4 pb-4 pt-1 ${
            isActive ? "h-auto" : "h-[110px]"
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className="mb-[3px] flex h-3 cursor-grab items-center justify-center active:cursor-grabbing"
          >
            <Dots className="w-5.75 text-font-disabled" />
          </div>

          <article className="flex justify-between gap-3">
            <div className="flex min-w-0 flex-1 gap-3">
              <label
                htmlFor={`asset-image-${index}`}
                className="relative flex size-[73px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-card opacity-80"
              >
                {assetImage ? (
                  <Image
                    src={typeof assetImage === "string" ? assetImage : ""}
                    alt={t("imageAlt")}
                    fill
                    sizes="96px"
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

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <p className="title-4 truncate text-font-1">
                  {displayAssetName}
                </p>
                <p className="body-7 line-clamp-2 text-font-2">
                  {assetSituation}
                </p>
              </div>
            </div>

            <div className="flex gap-2 text-font-2">
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex size-7 items-center justify-center rounded-full hover:bg-card"
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
            <div className="mt-4 flex flex-col items-end gap-5">
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
                descFontSize="body-7"
                error={currentAssetError?.assetSituation?.message}
              />
              <button
                type="button"
                onClick={toggleAssetVisibility}
                className={`title-6 flex items-center gap-1 rounded-lg px-2 py-1 ${
                  isPublicAsset
                    ? "bg-font-1 text-font-4"
                    : "bg-font-disabled text-font-1"
                }`}
              >
                {isPublicAsset ? (
                  <UnlockLine className="size-4" />
                ) : (
                  <LockLine className="size-4" />
                )}
                {isPublicAsset ? t("public") : t("private")}
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default AssetItem;
