"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useChatModelsQuery } from "@/api/chat/getChatModels";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import { useRoomMessagesInfiniteQuery } from "@/api/room/getRoomMessages";
import ChatForm from "@/components/chat/ChatForm";
import MessageList from "@/components/chat/MessageList";
import { ErrorState } from "@/components/state";
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
 * 방 상세(GET /rooms/{roomId})가 아직 캐릭터 이름/프로필을 내려주지 않아
 * 빈 값으로 둔다 — ChatContentBlock이 빈 값을 그대로 허용한다.
 */
const toChatMessage = (message: RoomMessage): ChatMessageType =>
  message.type === "AI"
    ? {
        id: message.messageId,
        role: "assistant",
        characterName: "",
        profileImage: "",
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

  const { isError: isRoomError, error: roomError, refetch: refetchRoom } =
    useRoomDetailQuery(roomId);

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
        .map(toChatMessage)
        .reverse(),
    [data],
  );

  // 전송 API 연결 전까지, 새로 보낸 메시지는 서버 이력과 별개로 화면에만 이어붙인다.
  const [sentMessages, setSentMessages] = useState<ChatMessageType[]>([]);
  const messages = useMemo(
    () => [...serverMessages, ...sentMessages],
    [serverMessages, sentMessages],
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

  const handleSendMessage = useCallback((message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    // 즉시 말풍선으로 이어지는 사용자 입력 상태
    setSentMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmedMessage,
      },
    ]);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    // 삭제 API가 아직 없어, 이번 세션에서 보낸 메시지만 화면에서 지울 수 있다.
    setSentMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId),
    );
  }, []);

  const handleRetryMessage = useCallback((messageId: string) => {
    // 재생성 API 연결 전까지는 같은 응답을 유지하며 다시하기 액션 자리만 보존
    setSentMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message } : message,
      ),
    );
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
            characterName=""
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
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      </div>
    </section>
  );
};

export default ChattingRoomSection;
