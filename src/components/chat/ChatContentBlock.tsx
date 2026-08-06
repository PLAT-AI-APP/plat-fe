"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CharacterChat from "@/components/chat/CharacterChat";
import Scenario from "@/components/chat/Scenario";
import { ChatRetry, ChatTrash, Close, Pen, Trash } from "@/icons";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import Check from "@/icons/Check";
import { parsePlat } from "@/lib/platParse";

interface ChatContentBlockProps {
  rawData: string;
  characterName: string;
  profileImage: string;
  isEditMode?: boolean;
  onUpdate?: (newContent: string) => void;
  onDelete?: () => void;
  onRetry?: () => void;
}

const ChatContentBlock = ({
  rawData,
  characterName,
  profileImage,
  isEditMode = false,
  onUpdate,
  onDelete,
  onRetry,
}: ChatContentBlockProps) => {
  const t = useTranslations();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(rawData);

  React.useEffect(() => {
    setEditedContent(rawData);
  }, [rawData]);

  const { textareaRef } = useAutoResizeTextarea({
    enabled: isEditing,
    value: editedContent,
  });

  const handleUpdate = () => {
    onUpdate?.(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(rawData);
    setIsEditing(false);
  };

  /** 대화 원문을 말풍선, 이미지, 서술문 블록으로 분리 */
  const blocks = useMemo(() => parsePlat(rawData), [rawData]);

  if (isEditing) {
    return (
      <div className="flex items-end gap-2">
        <div className="flex h-fit flex-1 gap-2 rounded-[0px_16px_16px_16px] bg-card p-2.5">
          <textarea
            ref={textareaRef}
            className="w-full resize-none overflow-hidden rounded-[0px_16px_16px_16px] bg-card-hover p-2.5 text-sm font-medium outline-none"
            value={editedContent}
            onChange={(event) => setEditedContent(event.target.value)}
          />
        </div>

        <div className="flex h-fit shrink-0 gap-1 text-font-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center rounded-lg p-1.5 hover:bg-btn-hover"
          >
            <Close className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="flex items-center justify-center rounded-lg p-1.5 hover:bg-btn-hover"
          >
            <Check className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {blocks.map((block, index) => {
        if (block.type === "DIALOGUE") {
          return (
            <CharacterChat
              key={index}
              image={profileImage}
              chatText={block.content}
              CharacterName={characterName}
            />
          );
        }

        if (block.type === "ASSET_IMG") {
          return (
            <Image
              key={index}
              src={block.code}
              alt={t("chatUI.chatAssetAlt")}
              width={171}
              height={250}
              unoptimized
              className="mx-auto h-[250px] w-[171px] rounded-2xl object-cover"
            />
          );
        }

        if (block.type === "NARRATIVE") {
          // 사용자 치환 토큰을 유지하는 서술문 표시용 문자열
          const fullText = block.segments
            .map((segment) =>
              segment.type === "TEXT" ? segment.value : "{{user}}",
            )
            .join("");

          return <Scenario key={index} text={fullText} />;
        }

        return null;
      })}

      {isEditMode && (
        <div className="-mt-4 flex gap-1 pl-11">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-card p-1.5 hover:bg-btn-hover"
          >
            <Pen className="size-4 text-font-2" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg bg-card p-1.5 hover:bg-btn-hover"
          >
            <Trash className="size-4 text-font-2" />
          </button>
        </div>
      )}

      {!isEditMode && (onDelete || onRetry) && (
        <div className="-mt-4 flex gap-1 pl-11">
          <button
            type="button"
            onClick={onDelete}
            className="flex size-7 items-center justify-center rounded-[9px] bg-card p-1.5 text-font-2 transition-colors hover:bg-btn-hover"
            aria-label={t("chatUI.deleteResponse")}
          >
            <ChatTrash className="size-4" />
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="flex size-7 items-center justify-center rounded-lg bg-card p-1.5 text-font-2 transition-colors hover:bg-btn-hover"
            aria-label={t("chatUI.retryResponse")}
          >
            <ChatRetry className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatContentBlock);
