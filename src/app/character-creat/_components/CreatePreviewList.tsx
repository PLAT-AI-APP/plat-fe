"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import CharacterChat from "@/components/chat/CharacterChat";
import Scenario from "@/components/chat/Scenario";
import Check from "@/icons/Check";
import { Close, Dots, Pen, Trash } from "@/icons";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  type: "chat" | "action" | "asset";
  value: string;
}

interface CreatePreviewListProps {
  contents: ContentItem[];
  characterName: string;
  profileImage: string;
  isEditable?: boolean;
  onUpdate?: (id: string, newValue: string) => void;
  onDelete?: (id: string) => void;
  onReorder?: (newContents: ContentItem[]) => void;
}

const CreatePreviewList = ({
  contents,
  characterName,
  profileImage,
  isEditable = false,
  onUpdate,
  onDelete,
  onReorder,
}: CreatePreviewListProps) => {
  const t = useTranslations("characterCreate.preview");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(contents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onReorder?.(items);
  };

  const startEditing = (item: ContentItem) => {
    setEditingId(item.id);
    setEditedValue(item.value);
  };

  const handleUpdate = (id: string) => {
    onUpdate?.(id, editedValue);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
                  <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                    <article
                      className={cn(
                        "group relative w-full rounded-2xl",
                        item.type === "action" && "px-2 pt-0",
                        editingId === item.id && "bg-transparent p-0",
                      )}
                      style={{ background: snapshot.isDragging ? "#181C2E" : "" }}
                    >
                      <div className="flex justify-center">
                        <div
                          {...dragProvided.dragHandleProps}
                          className="flex cursor-grab items-center justify-center rounded-[100px] p-1.5 hover:bg-card"
                        >
                          <Dots className="w-5.75 text-font-disabled" />
                        </div>
                      </div>

                      {editingId === item.id ? (
                        <div
                          id="edit-form-container"
                          className="flex flex-col gap-2"
                        >
                          {item.type === "chat" ? (
                            <div className="flex gap-2">
                              <Image
                                src={profileImage}
                                alt={t("profileAlt", { name: characterName })}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full"
                              />
                              <div className="flex-1 text-sm font-medium">
                                <span className="block">{characterName}</span>
                                <div className="mt-1.5 rounded-[0px_16px_16px_16px] bg-card px-3 py-2">
                                  <textarea
                                    autoFocus
                                    className="w-full resize-none rounded-xl bg-bg-darker px-4 py-3 text-sm font-medium outline-none"
                                    value={editedValue}
                                    onChange={(e) =>
                                      setEditedValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-1 gap-2 rounded-2xl bg-card p-2.5">
                              <textarea
                                autoFocus
                                className="w-full resize-none rounded-xl bg-bg-darker p-2.5 text-sm font-medium outline-none"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                              />
                            </div>
                          )}

                          {item.type !== "action" && (
                            <div
                              className={cn(
                                "flex h-fit shrink-0 gap-1 text-font-2",
                                item.type === "chat" && "pl-12",
                              )}
                            >
                              <button
                                onClick={handleCancel}
                                className="rounded-lg p-1.5 hover:bg-btn-hover"
                              >
                                <Close className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUpdate(item.id)}
                                className="rounded-lg p-1.5 hover:bg-btn-hover"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          id="view-content-container"
                          className={cn(
                            "flex pb-2",
                            item.type === "action"
                              ? "flex-col"
                              : "items-end gap-2",
                            item.type === "asset" && "justify-center",
                          )}
                        >
                          <div className="max-w-[80%]">
                            {item.type === "chat" && (
                              <CharacterChat
                                CharacterName={characterName}
                                chatText={item.value}
                                image={profileImage}
                              />
                            )}
                            {item.type === "action" && (
                              <Scenario text={item.value} />
                            )}
                            {item.type === "asset" && (
                              <Image
                                src={item.value}
                                alt={t("assetImageAlt")}
                                width={120}
                                height={120}
                                unoptimized
                                className="h-auto w-30 rounded-2xl"
                              />
                            )}
                          </div>

                          {isEditable && (
                            <div
                              className={cn(
                                "flex shrink-0 gap-1 transition-opacity",
                                item.type === "action" ? "mt-2 pl-12" : "mb-1",
                              )}
                            >
                              {item.type !== "asset" && (
                                <button
                                  onClick={() => startEditing(item)}
                                  className="rounded-lg p-1.5 hover:bg-btn-hover"
                                >
                                  <Pen className="h-4 w-4 text-font-2" />
                                </button>
                              )}

                              {item.type !== "chat" && (
                                <button
                                  onClick={() => onDelete?.(item.id)}
                                  className="rounded-lg p-1.5 hover:bg-btn-hover"
                                >
                                  <Trash className="h-4 w-4 text-font-2" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </article>

                    {item.type === "action" && editingId === item.id && (
                      <div className="flex h-fit shrink-0 gap-1 pt-2 text-font-2">
                        <button
                          onClick={handleCancel}
                          className="rounded-lg p-1.5 hover:bg-btn-hover"
                        >
                          <Close className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="rounded-lg p-1.5 hover:bg-btn-hover"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </section>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CreatePreviewList;
