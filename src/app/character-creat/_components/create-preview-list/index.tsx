"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ScenarioContentItem } from "@/type/character";
import PreviewListItem from "./PreviewListItem";
import { CreatePreviewListProps, PreviewEditLabels } from "./types";

const CreatePreviewList = ({
  contents,
  characterName,
  profileImage,
  isEditable = false,
  onUpdate,
  onDelete,
}: CreatePreviewListProps) => {
  const t = useTranslations("characterCreate.preview");
  const [editingId, setEditingId] = useState<string | null>(null);

  const labels: PreviewEditLabels = {
    editContent: t("editContent"),
    deleteContent: t("deleteContent"),
    cancelEdit: t("cancelEdit"),
    confirmEdit: t("confirmEdit"),
  };

  const startEditing = (item: ScenarioContentItem) => {
    setEditingId(item.id);
  };

  const handleUpdate = (id: string, value: string) => {
    onUpdate?.(id, value);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <Droppable droppableId="create-preview-list">
      {(provided) => (
        <section
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-1 flex-col gap-6"
        >
          {contents.map((item, index) => (
            <Draggable
              key={item.id.toString()}
              draggableId={item.id.toString()}
              index={index}
            >
              {(dragProvided, snapshot) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                >
                  <PreviewListItem
                    item={item}
                    isDragging={snapshot.isDragging}
                    isEditing={editingId === item.id}
                    characterName={characterName}
                    profileImage={profileImage}
                    profileAlt={t("profileAlt", { name: characterName })}
                    assetImageAlt={t("assetImageAlt")}
                    isEditable={isEditable}
                    labels={labels}
                    dragHandleProps={dragProvided.dragHandleProps}
                    onEdit={() => startEditing(item)}
                    onCancelEdit={handleCancel}
                    onConfirmEdit={(value) => handleUpdate(item.id, value)}
                    onDelete={() => onDelete?.(item.id)}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </section>
      )}
    </Droppable>
  );
};

export default CreatePreviewList;
