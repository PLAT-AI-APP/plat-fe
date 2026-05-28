import { CharacterCreateFormValues } from "@/schema/character.schema";
import React, { useRef, ChangeEvent } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import AssetItem from "./AssetItem";

const Asset = () => {
  const { control } = useFormContext<CharacterCreateFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "asset",
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const copyAsset = (index: number) => {
    // const target = watch(`asset.${index}`);
    // insert(index + 1, { ...target });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("jpg, png, webp 이미지 파일만 가능합니다.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 용량은 최대 5MB까지 가능합니다.");
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
    if (fields.length + 1 > 50) {
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <section className="flex flex-col gap-5.25">
      <header className="flex flex-col">
        <div className="flex items-center gap-1 title-3">
          <span>에셋 등록 ({fields.length}/50)</span>
        </div>
        <p className="body-5 text-font-2">
          상황에 어울리는 이미지를 등록해보세요. 최대 5MB
        </p>
      </header>

      <div id="asset-management-container" className="flex flex-col gap-1">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="asset-list-droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2 max-h-125 overflow-y-auto"
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
          className="body-4 py-2.5 mt-2 rounded-xl bg-bg-darkest border border-border-main hover:bg-card"
        >
          에셋 추가
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
