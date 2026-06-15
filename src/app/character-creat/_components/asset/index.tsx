"use client";

import React, { ChangeEvent, useRef } from "react";
import { useTranslations } from "next-intl";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useFieldArray, useFormContext } from "react-hook-form";
import AssetItem from "./AssetItem";
import { CharacterCreateFormValues } from "@/schema/character.schema";

const Asset = () => {
  const t = useTranslations("characterCreate.asset");
  const { control } = useFormContext<CharacterCreateFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "asset",
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const copyAsset = (index: number) => {
    void index;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      append({
        assetFile: null,
        assetName: file.name.split(".").slice(0, -1).join("."),
        assetImage: reader.result as string,
        assetSituation: "",
      });
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const addAsset = () => {
    if (fields.length + 1 > 50) return;
    fileInputRef.current?.click();
  };

  return (
    <section className="flex flex-col gap-5.25">
      <header className="flex flex-col">
        <div className="title-3 flex items-center gap-1">
          <span>{t("header", { count: fields.length })}</span>
        </div>
        <p className="body-5 text-font-2">{t("guide")}</p>
      </header>

      <div id="asset-management-container" className="flex flex-col gap-1">
        <DragDropContext onDragEnd={onDragEnd}>
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
                    copyAsset={copyAsset}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          type="button"
          onClick={addAsset}
          className="body-4 mt-2 rounded-xl border border-border-main bg-bg-darkest py-2.5 hover:bg-card"
        >
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
    </section>
  );
};

export default Asset;
