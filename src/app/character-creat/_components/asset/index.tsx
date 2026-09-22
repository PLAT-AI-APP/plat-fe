"use client";

import React, { ChangeEvent, useRef } from "react";
import { useTranslations } from "next-intl";
import { Droppable } from "@hello-pangea/dnd";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import AssetGuidePanel from "./AssetGuidePanel";
import AssetItem from "./AssetItem";
import { useUniverseAssetImageUploadMutation } from "@/api/universe/postUniverseAssetImage";
import { Plus } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { showAppToast } from "@/lib/toast";

interface AssetProps {
  assetFieldArray: UseFieldArrayReturn<
    CharacterCreateFormValues,
    "asset",
    "id"
  >;
}

// character.schema.ts의 assetName max(15)와 맞춥니다. 넘는 파일명을 그대로
// 채우면 저장을 누르기도 전에 길이 에러가 떠서 사용자가 이유를 알기 어렵습니다.
const ASSET_NAME_MAX_LENGTH = 15;

const Asset = ({ assetFieldArray }: AssetProps) => {
  const t = useTranslations("characterCreate.asset");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fields, append, remove } = assetFieldArray;
  const { getValues, setValue } = useFormContext<CharacterCreateFormValues>();
  const { mutateAsync: uploadAssetImage } =
    useUniverseAssetImageUploadMutation();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

    /*
     * 고르는 즉시 목록에 붙이고 업로드는 뒤에서 한다. 예전에는 업로드가 끝나야 항목이 생겨,
     * 모바일 회선에서는 몇 초 동안 아무 반응이 없었고 그 사이 다시 누르게 됐다.
     * 미리보기는 파일을 base64 로 읽지 않고 object URL 로 바로 만든다.
     *
     * 업로드 중에 순서를 바꾸거나 지울 수 있어, 끝난 뒤에는 인덱스가 아니라 이 미리보기 주소로
     * 항목을 다시 찾는다. fileId 가 채워지기 전까지 AssetItem 이 대기 표시를 하고,
     * 등록·임시저장과 시나리오로 끌어넣기는 막힌다.
     */
    const previewUrl = URL.createObjectURL(file);
    append({
      assetFile: null,
      assetName: file.name
        .split(".")
        .slice(0, -1)
        .join(".")
        .slice(0, ASSET_NAME_MAX_LENGTH),
      assetImage: previewUrl,
      assetImageFileId: null,
      assetSituation: "",
      assetVisibility: "PUBLIC",
    });
    e.target.value = "";

    const findIndex = () =>
      (getValues("asset") ?? []).findIndex(
        (asset) => asset.assetImage === previewUrl,
      );

    try {
      const uploadedImage = await uploadAssetImage({
        assetImageFile: file,
      });
      const index = findIndex();
      if (index === -1) return;

      setValue(`asset.${index}.assetImageFileId`, uploadedImage.fileId, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      // 실패 토스트는 MutationCache의 전역 에러 처리에서 이미 띄운다. 올리지 못한 항목은 목록에서 뺀다.
      console.error("Asset image upload failed:", error);
      const index = findIndex();
      if (index !== -1) remove(index);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const addAsset = () => {
    if (fields.length + 1 > 50) return;
    fileInputRef.current?.click();
  };

  return (
    <section className="flex flex-col">
      <header className="flex flex-col">
        <div className="title-3 flex items-center gap-1">
          <span>{t("header", { count: fields.length })}</span>
        </div>
        <p className="body-6 text-font-2">{t("guide")}</p>
      </header>

      <div id="asset-management-container" className="mt-5 flex flex-col">
        <Droppable droppableId="asset-list-droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              // 스크롤은 CreateTabs의 탭 콘텐츠 컨테이너가 담당합니다. 여기에 별도로
              // 고정 높이(overflow-y-auto)를 두면 에셋을 여러 개 펼쳤을 때 그 안에서만
              // 스크롤이 생겨 내용이 짤려 보입니다.
              className="flex flex-col gap-2"
            >
              {fields.map((field, i) => (
                <AssetItem
                  key={field.id}
                  id={field.id}
                  index={i}
                  remove={remove}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button
          type="button"
          onClick={addAsset}
          className="body-5 mt-2 flex h-[45px] items-center justify-center gap-2 rounded-xl bg-darkest text-font-2 hover:bg-card"
        >
          <Plus className="size-4" />
          {t("add")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
        />
      </div>

      <AssetGuidePanel />
    </section>
  );
};

export default Asset;
