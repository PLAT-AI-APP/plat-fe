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
import { parsePlatCached, segmentsToDisplayText } from "@/lib/platParse";
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

  // 같은 메시지가 가상화로 다시 마운트돼도 이전 파싱 결과를 재사용
  const blocks = useMemo(() => parsePlatCached(rawData), [rawData]);

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
              // 171x250 고정 상자에 object-cover 로 채우면 세로형이 아닌 에셋은 잘린다. 원본 비율을 그대로 두고
              // 250x250 안에 맞춘다 — 디자인이 전제한 세로형(171:250)은 예전과 같은 크기로 나온다.
              // width/height 는 로드 전 자리 힌트일 뿐이다.
              className="mx-auto h-auto w-auto max-h-[250px] max-w-[250px] rounded-2xl"
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
