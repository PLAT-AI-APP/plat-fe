"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import CharacterChat from "@/components/chat/CharacterChat";
import Scenario from "@/components/chat/Scenario";
import Image from "next/image";
import { Close, Dots, Pen, Trash } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: number;
  type: "chat" | "action" | "asset";
  value: string;
}

interface CreatePreviewListProps {
  contents: ContentItem[];
  characterName: string;
  profileImage: string;
  isEditable?: boolean;
  onUpdate?: (id: number, newValue: string) => void;
  onDelete?: (id: number) => void;
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
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const handleUpdate = (id: number) => {
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
            className="flex-1 flex flex-col gap-6"
          >
            {contents.map((item, index) => (
              <Draggable
                key={item.id.toString()}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <article
                      className={cn(
                        "relative group w-full rounded-2xl",
                        item.type === "action" && "px-2 pt-0",
                        editingId === item.id && "bg-transparent p-0",
                      )}
                      style={{
                        background: snapshot.isDragging ? "#181C2E" : "",
                      }}
                    >
                      {/* 드래그 핸들 */}
                      <div className="flex justify-center">
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center h-4 justify-center p-1.5 rounded-[100px] hover:bg-card cursor-grab"
                        >
                          <Dots className="text-font-disabled w-5.75" />
                        </div>
                      </div>

                      {editingId === item.id ? (
                        /* 수정 모드 */
                        <div
                          id="edit-form-container"
                          className="flex flex-col gap-2"
                        >
                          {item.type === "chat" ? (
                            <div className="flex gap-2">
                              <Image
                                src={profileImage}
                                alt={`${characterName} 프로필 이미지`}
                                width={40}
                                height={40}
                                className="rounded-full w-10 h-10"
                              />
                              <div className="flex-1 text-sm font-medium">
                                <span className="block">{characterName}</span>
                                <div className="mt-1.5 px-3 py-2 bg-card rounded-[0px_16px_16px_16px]">
                                  <textarea
                                    autoFocus
                                    className="w-full resize-none bg-bg-darker px-4 py-3 rounded-xl text-sm font-medium outline-none"
                                    value={editedValue}
                                    onChange={(e) =>
                                      setEditedValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "flex flex-1 h-fit gap-2 p-2.5 rounded-2xl",
                                "bg-card",
                              )}
                            >
                              <textarea
                                autoFocus
                                className="w-full resize-none bg-bg-darker p-2.5 rounded-xl text-sm font-medium outline-none"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                              />
                            </div>
                          )}

                          {item.type !== "action" && (
                            <div
                              className={cn(
                                "flex shrink-0 gap-1 text-font-2 h-fit",
                                item.type === "chat" && "pl-12",
                              )}
                            >
                              <button
                                onClick={handleCancel}
                                className="p-1.5 rounded-lg hover:bg-btn-hover"
                              >
                                <Close className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdate(item.id)}
                                className="p-1.5 rounded-lg hover:bg-btn-hover"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* 뷰 모드 */
                        <div
                          id="view-content-container"
                          className={cn(
                            `flex pb-2`,
                            item.type === "action"
                              ? "flex-col"
                              : "items-end gap-2",
                            item.type === "asset" && "justify-center",
                          )}
                        >
                          {/* 콘텐츠 렌더링 */}
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
                                alt="에셋 이미지"
                                width={120}
                                height={120}
                                unoptimized
                                className="w-30 h-auto rounded-2xl"
                              />
                            )}
                          </div>

                          {/* 편집 버튼 세트 */}
                          {isEditable && (
                            <div
                              className={cn(
                                "flex gap-1 transition-opacity shrink-0",
                                item.type === "action" ? "pl-12 mt-2" : "mb-1",
                              )}
                            >
                              {/* 수정 버튼 (chat, action 등에서 노출) */}
                              {item.type !== "asset" && (
                                <button
                                  onClick={() => startEditing(item)}
                                  className="p-1.5 rounded-lg hover:bg-btn-hover"
                                >
                                  <Pen className="w-4 h-4 text-font-2" />
                                </button>
                              )}

                              {/* 삭제 버튼 (asset, action 등에서 노출) */}
                              {item.type !== "chat" && (
                                <button
                                  onClick={() => onDelete?.(item.id)}
                                  className="p-1.5 rounded-lg hover:bg-btn-hover"
                                >
                                  <Trash className="w-4 h-4 text-font-2" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                    {item.type === "action" && editingId === item.id && (
                      <div className="flex shrink-0 gap-1 pt-2 text-font-2 h-fit">
                        <button
                          onClick={handleCancel}
                          className="p-1.5 rounded-lg hover:bg-btn-hover"
                        >
                          <Close className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="p-1.5 rounded-lg hover:bg-btn-hover"
                        >
                          <Check className="w-4 h-4" />
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
