"use client";

import React, { ChangeEvent, useRef } from "react";
import { useTranslations } from "next-intl";
import { Droppable } from "@hello-pangea/dnd";
import { UseFieldArrayReturn } from "react-hook-form";
import AssetGuidePanel from "./AssetGuidePanel";
import AssetItem from "./AssetItem";
import { useFileUploadMutation } from "@/api/file/postFileUpload";
import { Plus } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { showAppToast } from "@/lib/toast";

interface AssetProps {
  assetFieldArray: UseFieldArrayReturn<CharacterCreateFormValues, "asset", "id">;
}

const Asset = ({ assetFieldArray }: AssetProps) => {
  const t = useTranslations("characterCreate.asset");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fields, append, remove } = assetFieldArray;
  const { mutateAsync: uploadFile } = useFileUploadMutation();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showAppToast("warning", t("invalidType"), { size: "s" });
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showAppToast("warning", t("invalidSize"), { size: "s" });
      e.target.value = "";
      return;
    }

    try {
      const uploadedImage = await uploadFile({
        fileType: "CHARACTER_ASSET",
        file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        append({
          assetFile: null,
          assetName: file.name.split(".").slice(0, -1).join("."),
          assetImage: reader.result as string,
          assetImageId: uploadedImage.originalFileId,
          assetSituation: "",
          assetVisibility: "PUBLIC",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      // 실패 토스트는 axios 인터셉터 → MutationCache의 전역 에러 처리에서 이미 띄우므로 여기서 중복으로 띄우지 않습니다.
      console.error("Asset image upload failed:", error);
    }

    e.target.value = "";
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
        <p className="body-5 text-font-2">{t("guide")}</p>
      </header>

      <div id="asset-management-container" className="mt-5 flex flex-col">
        <Droppable droppableId="asset-list-droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex max-h-125 flex-col gap-2 overflow-y-auto"
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
          className="body-4 mt-2 flex h-[45px] items-center justify-center gap-2 rounded-xl bg-darkest text-font-2 hover:bg-card"
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
