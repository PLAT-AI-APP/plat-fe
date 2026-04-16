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
                {(provided) => (
                  <div>
                    <article
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "relative group w-full",
                        item.type === "action" &&
                          "bg-btn-hover rounded-2xl p-2 pt-0",
                      )}
                    >
                      {/* 드래그 핸들 */}
                      <div
                        {...provided.dragHandleProps}
                        className="flex items-center justify-center h-3 pb-1 cursor-grab"
                      >
                        <Dots className="text-font-disabled w-5.75" />
                      </div>

                      {editingId === item.id ? (
                        /* 수정 모드 (기존 유지) */
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-1 h-fit gap-2 bg-card p-2.5 rounded-2xl">
                            <textarea
                              autoFocus
                              className="w-full resize-none bg-bg-darker p-2.5 rounded-xl text-sm font-medium outline-none"
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              rows={3}
                            />
                          </div>
                          {item.type !== "action" && (
                            <div className="flex shrink-0 gap-1 text-font-2 h-fit">
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
                          className={cn(
                            `flex `,
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
                              className={`
                              flex gap-1 transition-opacity shrink-0
                              ${item.type === "action" ? "pl-12 mt-2" : "mb-1"} 
                            `}
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
