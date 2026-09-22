"use client";

import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChatMessageType } from "@/type/chat";
import AiSuggestedChat from "./AiSuggestedChat";
import ChatContentBlock from "./ChatContentBlock";
import UserChatBubble from "./UserChatBubble";

interface MessageListProps {
  messages: ChatMessageType[];
  scrollContainer: HTMLDivElement | null;
  isEditable?: boolean;
  onUpdateMessage?: (id: string, newContent: string) => void;
  onDeleteMessage?: (id: string) => void;
  onRetryMessage?: (id: string) => void;
  isAiSuggestedChat?: boolean;
}

interface MessageRowProps {
  message: ChatMessageType;
  isEditable: boolean;
  showSuggestedChat: boolean;
  onUpdateMessage?: MessageListProps["onUpdateMessage"];
  onDeleteMessage?: MessageListProps["onDeleteMessage"];
  onRetryMessage?: MessageListProps["onRetryMessage"];
}

const MessageRow = memo(
  ({
    message,
    isEditable,
    showSuggestedChat,
    onUpdateMessage,
    onDeleteMessage,
    onRetryMessage,
  }: MessageRowProps) => {
    const handleUpdate = useCallback(
      (newContent: string) => onUpdateMessage?.(message.id, newContent),
      [message.id, onUpdateMessage],
    );
    const handleDelete = useCallback(
      () => onDeleteMessage?.(message.id),
      [message.id, onDeleteMessage],
    );
    const handleRetry = useCallback(
      () => onRetryMessage?.(message.id),
      [message.id, onRetryMessage],
    );

    if (message.role === "assistant") {
      return (
        <div className="flex flex-col gap-6">
          <ChatContentBlock
            rawData={message.content}
            characterName={message.characterName || ""}
            profileImage={message.profileImage || ""}
            isStreaming={message.isStreaming}
            isEditMode={isEditable}
            onUpdate={handleUpdate}
            // 시나리오는 캐릭터가 만든 응답이 아니라 지우거나 다시 만들 대상이 아니다.
            onDelete={message.isScenario ? undefined : handleDelete}
            onRetry={message.isScenario ? undefined : handleRetry}
          />
          {/* 추천 답변은 응답을 다 받은 뒤에 붙인다. 받는 동안 붙이면 입력 중 표시 밑에 먼저 떠 버린다. */}
          {showSuggestedChat && !message.isStreaming && <AiSuggestedChat />}
        </div>
      );
    }

    return (
      <UserChatBubble
        text={message.content}
        isEditable={isEditable}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    );
  },
  (previous, next) => {
    const isSameMessage =
      previous.message.id === next.message.id &&
      previous.message.role === next.message.role &&
      previous.message.content === next.message.content &&
      (previous.message.role !== "assistant" ||
        (next.message.role === "assistant" &&
          previous.message.characterName === next.message.characterName &&
          previous.message.profileImage === next.message.profileImage &&
          previous.message.isStreaming === next.message.isStreaming &&
          previous.message.isScenario === next.message.isScenario));

    return (
      isSameMessage &&
      previous.isEditable === next.isEditable &&
      previous.showSuggestedChat === next.showSuggestedChat &&
      previous.onUpdateMessage === next.onUpdateMessage &&
      previous.onDeleteMessage === next.onDeleteMessage &&
      previous.onRetryMessage === next.onRetryMessage
    );
  },
);

MessageRow.displayName = "MessageRow";

const estimateMessageHeight = (message?: ChatMessageType) => {
  if (!message) return 160;

  const estimatedLines = Math.max(1, Math.ceil(message.content.length / 48));
  const textHeight = Math.min(estimatedLines * 24, 480);

  if (message.role === "assistant") {
    const imageHeight = message.content.includes("{{img:") ? 274 : 0;
    return 72 + textHeight + imageHeight;
  }

  return 24 + textHeight;
};

const MessageList = memo(
  ({
    messages,
    scrollContainer,
    isEditable = false,
    onUpdateMessage,
    onDeleteMessage,
    onRetryMessage,
    isAiSuggestedChat = true,
  }: MessageListProps) => {
    const listRef = useRef<HTMLElement>(null);
    const messagesRef = useRef(messages);
    const hasScrolledToLatestRef = useRef(false);
    const [scrollMargin, setScrollMargin] = useState(0);
    messagesRef.current = messages;

    // 마지막 응답부터 역방향으로 확인해 긴 대화의 전체 순회 방지
    const lastAssistantIndex = useMemo(() => {
      for (let index = messages.length - 1; index >= 0; index -= 1) {
        if (messages[index].role === "assistant") return index;
      }
      return -1;
    }, [messages]);

    useLayoutEffect(() => {
      const listElement = listRef.current;
      const scrollElement = scrollContainer;
      if (!listElement || !scrollElement) return;

      const updateScrollMargin = () => {
        const listTop = listElement.getBoundingClientRect().top;
        const scrollTop = scrollElement.getBoundingClientRect().top;
        const nextMargin = Math.round(listTop - scrollTop + scrollElement.scrollTop);

        setScrollMargin((currentMargin) =>
          currentMargin === nextMargin ? currentMargin : nextMargin,
        );
      };

      updateScrollMargin();

      // 목록 앞 요소의 높이가 바뀌어도 가상 행의 기준 위치를 실제 목록 시작점과 동기화
      const resizeObserver = new ResizeObserver(updateScrollMargin);
      resizeObserver.observe(scrollElement);

      let sibling = listElement.previousElementSibling;
      while (sibling) {
        resizeObserver.observe(sibling);
        sibling = sibling.previousElementSibling;
      }

      return () => resizeObserver.disconnect();
    }, [scrollContainer]);

    const getItemKey = useCallback(
      (index: number) => messagesRef.current[index]?.id ?? index,
      [],
    );
    const estimateSize = useCallback(
      (index: number) => estimateMessageHeight(messagesRef.current[index]),
      [],
    );

    // 가변 높이 측정 함수를 제공하는 TanStack Virtual 특성상 React Compiler 자동 메모화 제외 허용
    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
      count: messages.length,
      getScrollElement: () => scrollContainer,
      getItemKey,
      estimateSize,
      gap: 24,
      overscan: 4,
      paddingEnd: 24,
      scrollMargin,
      anchorTo: "end",
      followOnAppend: true,
      scrollEndThreshold: 48,
      useFlushSync: false,
    });

    useLayoutEffect(() => {
      if (
        hasScrolledToLatestRef.current ||
        !scrollContainer ||
        messages.length === 0
      ) {
        return;
      }

      // 추정 높이가 준비된 뒤 최신 메시지로 이동해 실제 높이 측정 중에도 하단 기준 유지
      virtualizer.scrollToEnd();
      hasScrolledToLatestRef.current = true;
    }, [messages.length, scrollContainer, virtualizer]);

    return (
      <section
        ref={listRef}
        id="chat-message-list"
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualMessage) => {
          const message = messages[virtualMessage.index];
          if (!message) return null;

          return (
            <article
              key={virtualMessage.key}
              ref={virtualizer.measureElement}
              data-index={virtualMessage.index}
              className="absolute left-0 top-0 w-full px-4"
              style={{
                transform: `translateY(${virtualMessage.start - scrollMargin}px)`,
              }}
            >
              <MessageRow
                message={message}
                isEditable={isEditable}
                showSuggestedChat={
                  virtualMessage.index === lastAssistantIndex && isAiSuggestedChat
                }
                onUpdateMessage={onUpdateMessage}
                onDeleteMessage={onDeleteMessage}
                onRetryMessage={onRetryMessage}
              />
            </article>
          );
        })}
      </section>
    );
  },
);

MessageList.displayName = "MessageList";

export default MessageList;
