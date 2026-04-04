import { CharacterCreateFormValues } from "@/type/character";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import AssetItem from "./AssetItem";

const Asset = () => {
  const { control, watch } = useFormContext<CharacterCreateFormValues>();

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "asset",
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const copyAsset = (index: number) => {
    const target = watch(`asset.${index}`);
    insert(index + 1, { ...target });
  };

  const addAsset = () => {
    if (fields.length + 1 > 50) {
      return;
    }
    append({
      assetFile: null,
      assetName: "",
      assetImage: "",
      assetSituation: "",
    });
  };

  return (
    <section className="flex flex-col gap-5.25">
      <header className="flex flex-col">
        <div className="flex items-center gap-1 font-semibold text-sm">
          <span>에셋 등록 ({fields.length}/50)</span>
        </div>
        <p className="text-xs text-font-2">
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
          className="text-sm font-medium py-2.5 mt-2 rounded-xl bg-bg-darkest border border-border-main hover:bg-card"
        >
          에셋 추가
        </button>
      </div>
    </section>
  );
};

export default Asset;
