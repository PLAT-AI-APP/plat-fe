"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useChatModelsQuery } from "@/api/chat/getChatModels";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import { useRoomMessagesInfiniteQuery } from "@/api/room/getRoomMessages";
import { useUniverseDetailQuery } from "@/api/universe/getUniverseDetail";
import ChatForm from "@/components/chat/ChatForm";
import MessageList from "@/components/chat/MessageList";
import { ErrorState } from "@/components/state";
import { useChatTurn } from "@/hooks/chat/useChatTurn";
import { useIntersectionObserver } from "@/hooks/dom/useIntersectionObserver";
import { useScrollTimeout } from "@/hooks/dom/useScrollTiemout";
import { toAiModel } from "@/lib/chatModel";
import { cn } from "@/lib/utils";
import { AIModelType, ChatMessageType } from "@/type/chat";
import type { RoomMessage } from "@/type/room";
import ChattingRoomHeader from "./ChattingRoomHeader";
import ChattingRoomNotice from "./ChattingRoomNotice";

interface ChattingRoomSectionProps {
  roomId: string;
}

/**
 * 방 상세는 universeId만 주므로 캐릭터 이름/프로필은 세계관 상세에서 받아 넣는다.
 * 세계관을 아직 못 받았을 때는 빈 값으로 둔다 — ChatContentBlock이 빈 값을 그대로 허용한다.
 */
const toChatMessage = (
  message: RoomMessage,
  characterName: string,
  profileImage: string,
): ChatMessageType =>
  message.type === "AI"
    ? {
        id: message.messageId,
        role: "assistant",
        characterName,
        profileImage,
        content: message.content,
      }
    : {
        id: message.messageId,
        role: "user",
        content: message.content,
      };

const ChattingRoomSection = ({ roomId }: ChattingRoomSectionProps) => {
  const { isScrolling, onScroll } = useScrollTimeout();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const handleScrollContainerRef = useCallback((element: HTMLDivElement | null) => {
    scrollContainerRef.current = element;
    setScrollContainer(element);
  }, []);

  const {
    data: room,
    isError: isRoomError,
    error: roomError,
    refetch: refetchRoom,
  } = useRoomDetailQuery(roomId);
  const { data: universe } = useUniverseDetailQuery(room?.universeId);
  const characterName = universe?.character.name ?? "";
  const profileImage = universe?.character.profileImageUrl ?? "";

  const {
    data,
    isPending: isMessagesPending,
    isError: isMessagesError,
    error: messagesError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch: refetchMessages,
  } = useRoomMessagesInfiniteQuery(roomId);

  // 과거 방향으로 페이지가 이어지므로, 화면엔 오래된 메시지가 위로 오도록 순서를 뒤집는다.
  const serverMessages = useMemo<ChatMessageType[]>(
    () =>
      (data?.pages.flatMap((page) => page.content) ?? [])
        .map((message) => toChatMessage(message, characterName, profileImage))
        .reverse(),
    [data, characterName, profileImage],
  );

  const [isSuggestedReplyOn, setIsSuggestedReplyOn] = useState(true);
  const { data: chatCatalog } = useChatModelsQuery();
  const models = useMemo(
    () => chatCatalog?.models.map(toAiModel) ?? [],
    [chatCatalog],
  );
  // 서버에 방별 모델 저장이 없어 화면에서만 기억하고, 고르기 전엔 목록 첫 모델을 쓴다.
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const currentAi = models.find((model) => model.id === selectedModelId) ?? models[0];

  const handleCurrentAi = useCallback((model: AIModelType) => {
    setSelectedModelId(model.id);
  }, []);

  // 진행 중인 턴의 말풍선은 서버 이력과 별개로 이어붙이고, 저장이 끝나 이력에 들어오면 훅이 치운다.
  const { pendingMessages, isBusy, sendMessage } = useChatTurn({
    roomId,
    universeCharacterId: universe?.character.universeCharacterId,
    personaId: room?.personaId,
    modelId: currentAi?.id,
    multiplier: room?.multiplier,
    characterName,
    profileImage,
  });
  const messages = useMemo(
    () => [...serverMessages, ...pendingMessages],
    [serverMessages, pendingMessages],
  );

  const handleDeleteMessage = useCallback(() => {
    // 메시지 삭제 API가 아직 없어 동작하지 않는다. 버튼 자리만 보존한다.
  }, []);

  const handleRetryMessage = useCallback(() => {
    // 재생성 API가 아직 없어 동작하지 않는다. 버튼 자리만 보존한다.
  }, []);

  const handleLoadOlderMessages = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { targetRef: topSentinelRef } = useIntersectionObserver({
    onIntersect: handleLoadOlderMessages,
    enabled: Boolean(hasNextPage) && !isMessagesPending,
  });

  if (isRoomError) {
    return (
      <section className="flex h-full min-h-0 flex-1 items-center justify-center bg-dark">
        <ErrorState error={roomError} onRetry={refetchRoom} />
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-1 justify-center bg-dark pt-2">
      <div className="flex h-full w-full max-w-[867px] flex-col">
        <div
          ref={handleScrollContainerRef}
          onScroll={onScroll}
          className={cn(
            "relative flex-1 overflow-y-auto hide-scrollbar-on-idle",
            isScrolling && "is-scrolling",
          )}
        >
          <ChattingRoomHeader
            roomId={roomId}
            characterName={characterName}
            models={models}
            currentAi={currentAi}
            handleCurrentAi={handleCurrentAi}
            isSuggestedReplyOn={isSuggestedReplyOn}
            onSuggestedReplyToggle={() =>
              setIsSuggestedReplyOn((prevState) => !prevState)
            }
          />
          <ChattingRoomNotice />

          {hasNextPage && (
            <div ref={topSentinelRef} aria-hidden="true" className="h-px" />
          )}

          {isMessagesError && serverMessages.length === 0 ? (
            <ErrorState error={messagesError} onRetry={refetchMessages} />
          ) : (
            <MessageList
              messages={messages}
              scrollContainer={scrollContainer}
              isAiSuggestedChat={isSuggestedReplyOn}
              onDeleteMessage={handleDeleteMessage}
              onRetryMessage={handleRetryMessage}
            />
          )}
        </div>

        {/* 메시지 목록이 px-4 를 쓰므로 입력창도 같은 여백을 써야 줄이 맞는다. */}
        <div className="shrink-0 bg-dark px-4 py-4">
          <ChatForm onSendMessage={sendMessage} disabled={isBusy} />
        </div>
      </div>
    </section>
  );
};

export default ChattingRoomSection;
