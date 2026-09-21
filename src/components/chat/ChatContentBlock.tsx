"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import CharacterChat from "@/components/chat/CharacterChat";
import ResourceImage from "@/components/ResourceImage";
import InlineEditActions from "@/components/chat/InlineEditActions";
import Scenario from "@/components/chat/Scenario";
import UserChatBubble from "@/components/chat/UserChatBubble";
import { ChatRetry, ChatTrash, Pen, Trash } from "@/icons";
import { useAutoResizeTextarea } from "@/hooks/form/useAutoResizeTextarea";
import { useInlineTextEdit } from "@/hooks/form/useInlineTextEdit";
import { getResourceImageUrl } from "@/lib/file";
import {
  parsePlatCached,
  parsePlatStreaming,
  segmentsToDisplayText,
} from "@/lib/platParse";
import { useUserDisplayName } from "@/hooks/data/useUserDisplayName";
import { TRANSITION_FAST, slideUpVariants } from "@/constants/motion";

interface ChatContentBlockProps {
  rawData: string;
  characterName: string;
  profileImage: string;
  /** 스트림으로 받는 중인 응답. 반쯤 온 블록을 미리 닫아 그리고, 삭제·다시하기 버튼은 숨긴다. */
  isStreaming?: boolean;
  isEditMode?: boolean;
  onUpdate?: (newContent: string) => void;
  onDelete?: () => void;
  onRetry?: () => void;
}

interface TypingIndicatorProps {
  characterName: string;
  profileImage: string;
}

const TYPING_DOTS = [0, 1, 2] as const;

/** 첫 글자가 오기 전, 캐릭터가 답장을 쓰고 있다는 표시. 전송 후 빈 화면이다가 응답이 툭 나타나지 않게 한다. */
const TypingIndicator = ({
  characterName,
  profileImage,
}: TypingIndicatorProps) => {
  const t = useTranslations();

  return (
    <m.article
      {...slideUpVariants}
      transition={TRANSITION_FAST}
      role="status"
      aria-label={t("chatUI.characterTyping", { name: characterName })}
      className="flex gap-2"
    >
      {/* CharacterChat 과 같은 자리·크기를 써야 첫 글자가 오며 말풍선으로 바뀔 때 흔들리지 않는다. */}
      {profileImage ? (
        <ResourceImage
          src={profileImage}
          alt=""
          width={36}
          height={36}
          unoptimized
          className="avatar-img size-9"
        />
      ) : (
        <span className="size-9 shrink-0 rounded-full bg-card" aria-hidden />
      )}

      <div className="body-5">
        <span className="body-6 mb-1.5 block text-font-1">{characterName}</span>
        <div className="flex h-9 w-fit items-center gap-1 rounded-[0px_16px_16px_16px] bg-card px-3">
          {TYPING_DOTS.map((dot) => (
            <m.span
              key={dot}
              aria-hidden
              className="size-1.5 rounded-full bg-font-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
            />
          ))}
        </div>
      </div>
    </m.article>
  );
};

const ChatContentBlock = ({
  rawData,
  characterName,
  profileImage,
  isStreaming = false,
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

  // 같은 메시지가 가상화로 다시 마운트돼도 이전 파싱 결과를 재사용한다.
  // 받는 중인 응답은 글자마다 원문이 바뀌어 캐시 대신 마지막 블록을 미리 닫아 파싱한다.
  const blocks = useMemo(
    () => (isStreaming ? parsePlatStreaming(rawData) : parsePlatCached(rawData)),
    [rawData, isStreaming],
  );

  // 버튼은 캐릭터 응답 맨 아래 왼쪽에 붙는다. 사용자 대사로 끝나면 오른쪽 사용자 말풍선 밑에 걸려
  // 사용자 말에 딸린 버튼처럼 보이므로 그리지 않는다.
  const endsWithUserDialogue = blocks.at(-1)?.type === "USER_DIALOGUE";

  if (isStreaming && blocks.length === 0) {
    return (
      <TypingIndicator characterName={characterName} profileImage={profileImage} />
    );
  }

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

      {isEditMode && !isStreaming && (
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

      {/* 받는 중인 응답은 아직 서버에 없어 지우거나 다시 만들 대상이 없다. */}
      {!isEditMode && !isStreaming && !endsWithUserDialogue && (onDelete || onRetry) && (
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
