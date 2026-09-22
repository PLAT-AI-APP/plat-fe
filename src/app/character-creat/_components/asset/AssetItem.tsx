"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Draggable } from "@hello-pangea/dnd";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
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

const formOptions = { shouldDirty: true, shouldValidate: true } as const;

interface AssetItemProps {
  id: string;
  index: number;
  remove: (index: number) => void;
}

const AssetItem = ({ id, index, remove }: AssetItemProps) => {
  const t = useTranslations("characterCreate.asset");
  const { register, setValue, getValues, control } =
    useFormContext<CharacterCreateFormValues>();
  // 이 에셋의 오류만 구독한다. useFormContext().formState.errors 를 읽으면 루트 폼 전체가 오류
  // 구독자가 되어, 이 탭을 한 번 연 뒤로는 어느 칸이든 유효↔무효가 바뀔 때마다 폼 전체가 다시 그려졌다.
  const { errors } = useFormState({ control, name: `asset.${index}` });
  const [isActive, setIsActive] = useState(false);
  const { mutateAsync: uploadAssetImage } =
    useUniverseAssetImageUploadMutation();
  const assetImage = useWatch({ control, name: `asset.${index}.assetImage` });
  const assetImageFileId = useWatch({
    control,
    name: `asset.${index}.assetImageFileId`,
  });
  // 미리보기는 떴지만 아직 fileId 를 못 받은 상태 = 뒤에서 올리는 중.
  const isUploading = Boolean(assetImage) && !assetImageFileId;
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

    // 고른 이미지를 바로 보여 주고 업로드는 뒤에서 한다(asset/index.tsx 와 같은 방식).
    const previousImage = getValues(`asset.${index}.assetImage`);
    const previousFileId = getValues(`asset.${index}.assetImageFileId`);
    const previewUrl = URL.createObjectURL(file);
    setValue(`asset.${index}.assetImage`, previewUrl, formOptions);
    setValue(`asset.${index}.assetImageFileId`, null, formOptions);
    e.target.value = "";

    // 업로드 중에 순서가 바뀔 수 있어 미리보기 주소로 항목을 다시 찾는다.
    const findIndex = () =>
      (getValues("asset") ?? []).findIndex(
        (asset) => asset.assetImage === previewUrl,
      );

    try {
      const uploadedImage = await uploadAssetImage({
        assetImageFile: file,
      });
      const currentIndex = findIndex();
      if (currentIndex === -1) return;

      setValue(
        `asset.${currentIndex}.assetImageFileId`,
        uploadedImage.fileId,
        formOptions,
      );
      if (previousImage?.startsWith("blob:")) URL.revokeObjectURL(previousImage);
    } catch (error) {
      // 실패 토스트는 MutationCache의 전역 에러 처리에서 이미 띄운다. 앞 이미지로 되돌린다.
      console.error("Asset image upload failed:", error);
      const currentIndex = findIndex();
      if (currentIndex !== -1) {
        setValue(`asset.${currentIndex}.assetImage`, previousImage, formOptions);
        setValue(
          `asset.${currentIndex}.assetImageFileId`,
          previousFileId,
          formOptions,
        );
      }
      URL.revokeObjectURL(previewUrl);
    }
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
                    unoptimized
                    className="object-cover"
                  />
                ) : null}
                {isUploading ? (
                  <span
                    role="status"
                    aria-label={t("uploading")}
                    className="absolute inset-0 flex items-center justify-center bg-scrim/40"
                  >
                    <span
                      aria-hidden="true"
                      className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                  </span>
                ) : assetImage ? null : (
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
