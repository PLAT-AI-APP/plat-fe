"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CharacterChat from "@/components/chat/CharacterChat";
import InlineEditActions from "@/components/chat/InlineEditActions";
import Scenario from "@/components/chat/Scenario";
import UserChatBubble from "@/components/chat/UserChatBubble";
import { ChatRetry, ChatTrash, Pen, Trash } from "@/icons";
import { useAutoResizeTextarea } from "@/hooks/form/useAutoResizeTextarea";
import { useInlineTextEdit } from "@/hooks/form/useInlineTextEdit";
import { getResourceImageUrl } from "@/lib/file";
import { parsePlat, segmentsToDisplayText } from "@/lib/platParse";
import { useUserDisplayName } from "@/hooks/data/useUserDisplayName";

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
  const userDisplayName = useUserDisplayName();
  const {
    isEditing,
    draft: editedContent,
    setDraft: setEditedContent,
    startEditing,
    handleCancel,
    handleSubmit: handleUpdate,
    handleKeyDown,
    handleFocus,
  } = useInlineTextEdit({ value: rawData, onSubmit: onUpdate });

  const { textareaRef } = useAutoResizeTextarea({
    enabled: isEditing,
    value: editedContent,
  });

  /** 대화 원문을 말풍선, 이미지, 서술문 블록으로 분리 */
  const blocks = useMemo(() => parsePlat(rawData), [rawData]);

  if (isEditing) {
    return (
      <div className="flex items-end gap-2">
        <div className="flex h-fit flex-1 gap-2 rounded-[0px_16px_16px_16px] bg-card p-2.5">
          <textarea
            ref={textareaRef}
            autoFocus
            className="body-5 w-full resize-none overflow-hidden rounded-[0px_16px_16px_16px] border border-transparent bg-card-hover p-2.5 outline-none transition-colors focus:field-focus!"
            value={editedContent}
            onChange={(event) => setEditedContent(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
          />
        </div>

        <InlineEditActions onCancel={handleCancel} onConfirm={handleUpdate} />
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
              chatText={segmentsToDisplayText(block.segments, userDisplayName)}
              CharacterName={characterName}
            />
          );
        }

        if (block.type === "USER_DIALOGUE") {
          return (
            <UserChatBubble key={index} text={segmentsToDisplayText(block.segments, userDisplayName)} />
          );
        }

        if (block.type === "ASSET_IMG") {
          return (
            <Image
              key={index}
              // block.code는 세계관 에셋 업로드로 받은 fileId이므로, 렌더링용 URL로 변환해야 합니다.
              src={getResourceImageUrl(block.code, "UNIVERSE_ASSET")}
              alt={t("chatUI.chatAssetAlt")}
              width={171}
              height={250}
              unoptimized
              className="mx-auto h-[250px] w-[171px] rounded-2xl object-cover"
            />
          );
        }

        if (block.type === "NARRATIVE") {
          return (
            <Scenario key={index} text={segmentsToDisplayText(block.segments, userDisplayName)} />
          );
        }

        return null;
      })}

      {isEditMode && (
        <div className="-mt-4 flex gap-1 pl-11">
          <button
            type="button"
            onClick={startEditing}
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
            className="flex size-7 items-center justify-center rounded-lg bg-card p-1.5 text-font-2 transition-colors hover:bg-btn-hover"
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
