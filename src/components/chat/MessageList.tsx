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
import { m } from "framer-motion";
import { EASE_OUT } from "@/constants/motion";
import { cn } from "@/lib/utils";
import { ChatMessageType } from "@/type/chat";
import AiSuggestedChat from "./AiSuggestedChat";
import ChatContentBlock from "./ChatContentBlock";
import UserChatBubble from "./UserChatBubble";

interface MessageListProps {
  messages: ChatMessageType[];
  scrollContainer: HTMLDivElement | null;
  isEditable?: boolean;
  /** 소설로 보기. 말풍선·프로필 없이 글만 이어서 보여 준다. */
  isNovelView?: boolean;
  /** {{user}} 자리와 소설형 내 말 앞에 쓸 이름. 채팅방에서는 방의 페르소나 이름이다. 없으면 계정 닉네임. */
  userName?: string;
  /** 성인 세계관 에셋의 서명 URL(파일 ID → URL). 일반 세계관은 없다. */
  assetImageUrls?: Record<string, string>;
  /** 이미 풀린 에셋 파일 id. 받는 중인 답에서 처음 풀린 에셋을 가려내 해금 연출을 튼다. */
  unlockedAssetIds?: ReadonlySet<string>;
  onUpdateMessage?: (id: string, newContent: string) => void;
  /** 턴 삭제. 서버에 저장된 메시지에만 버튼이 뜬다. */
  onDeleteMessage?: (id: string) => void;
  /** 답 다시 만들기. 저장된 답이면 어느 답에든 버튼이 뜬다 — 중간 답은 확정되면 뒤 대화가 지워진다. */
  onRetryMessage?: (id: string) => void;
  /** AI 응답 신고. 서버 id(숫자)를 받은 응답에만 버튼이 뜬다 — 받는 중인 임시 응답은 신고할 대상이 없다. */
  onReportMessage?: (id: string) => void;
  /** 마지막 답과 함께 온 추천 문장. 비어 있으면 추천 줄이 뜨지 않는다. */
  suggestions?: string[];
  /** 추천 문장을 골랐을 때. 입력창에 넣기만 하고 보내지는 않는다. */
  onSuggestionSelect?: (text: string) => void;
  /** 방을 막 만들어 들어왔다. 시나리오가 막이 오르듯 한 줄씩 올라온다. */
  playScenarioIntro?: boolean;
}

/** 서버에 저장된 메시지 id 는 숫자(Snowflake)다. 받는 중·보내는 중인 임시 메시지는 다른 모양의 id 를 쓴다. */
const SERVER_MESSAGE_ID = /^\d+$/;

/**
 * 등장 연출을 이미 튼 임시 메시지 id.
 * 가상 스크롤로 줄이 다시 그려지거나 방을 다시 열어도 같은 말풍선이 또 떠오르지 않게 모듈에 둔다.
 * 서버 이력(숫자 id)은 처음부터 연출하지 않는다 — 방금 보낸·받는 말만 움직인다.
 */
const enteredMessageIds = new Set<string>();

/** 다시 만들기로 가려질 옛 답이 흐려지는 시간. 채팅방 화면이 이만큼 기다렸다 목록에서 뺀다. */
export const DISSOLVE_MS = 350;

/**
 * 방금 보낸·받는 말풍선의 등장. 내 말은 입력창에서 올라오듯, 캐릭터 말은 제자리에서 옅게 피어나듯.
 * 대화 흐름 속이라 아주 짧고 차분하게 둔다.
 */
const EnterOnce = ({
  id,
  role,
  children,
}: {
  id: string;
  role: ChatMessageType["role"];
  children: React.ReactNode;
}) => {
  const [shouldEnter] = useState(() => {
    if (SERVER_MESSAGE_ID.test(id) || enteredMessageIds.has(id)) return false;
    enteredMessageIds.add(id);
    return true;
  });
  if (!shouldEnter) return <>{children}</>;

  const isMine = role === "user";
  return (
    <m.div
      initial={isMine ? { opacity: 0, y: 18, scale: 0.96 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: isMine ? 0.32 : 0.45, ease: EASE_OUT }}
      style={{ originX: isMine ? 1 : 0, originY: 1 }}
    >
      {children}
    </m.div>
  );
};

/** 기본값을 매 렌더 새로 만들면 마지막 줄의 memo 비교가 늘 어긋난다. */
const EMPTY_SUGGESTIONS: string[] = [];

interface MessageRowProps {
  message: ChatMessageType;
  isEditable: boolean;
  isNovelView: boolean;
  userName?: string;
  assetImageUrls?: Record<string, string>;
  unlockedAssetIds?: ReadonlySet<string>;
  /** 이 줄 아래에 붙일 추천 문장. 마지막 답에만 넘어온다. */
  suggestions: string[];
  /** 방을 막 만들어 들어왔을 때 시나리오를 한 줄씩 올린다 */
  playScenarioIntro: boolean;
  onSuggestionSelect?: MessageListProps["onSuggestionSelect"];
  onUpdateMessage?: MessageListProps["onUpdateMessage"];
  onDeleteMessage?: MessageListProps["onDeleteMessage"];
  onRetryMessage?: MessageListProps["onRetryMessage"];
  onReportMessage?: MessageListProps["onReportMessage"];
}

const MessageRow = memo(
  ({
    message,
    isEditable,
    isNovelView,
    userName,
    assetImageUrls,
    unlockedAssetIds,
    suggestions,
    playScenarioIntro,
    onSuggestionSelect,
    onUpdateMessage,
    onDeleteMessage,
    onRetryMessage,
    onReportMessage,
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
    const handleReport = useCallback(
      () => onReportMessage?.(message.id),
      [message.id, onReportMessage],
    );
    const isStoredMessage = SERVER_MESSAGE_ID.test(message.id);
    // 보내는 중·받는 중인 임시 메시지는 아직 서버에 없어 지울 대상이 없다.
    const canDelete = Boolean(onDeleteMessage) && isStoredMessage;

    // 다시 만들기로 가려질 옛 답과 뒤 대화는 흐려지며 가라앉는다(버튼 없이 그림만)
    if (message.isDissolving) {
      return (
        <m.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, filter: "blur(6px)", y: 6, scale: 0.98 }}
          transition={{ duration: DISSOLVE_MS / 1000, ease: EASE_OUT }}
        >
          {message.role === "assistant" ? (
            <ChatContentBlock
              rawData={message.content}
              characterName={message.characterName || ""}
              profileImage={message.profileImage || ""}
              isNovelView={isNovelView}
              userName={userName}
              assetImageUrls={assetImageUrls}
            />
          ) : (
            <UserChatBubble
              text={message.content}
              isEditable={false}
              isNovelView={isNovelView}
              userName={userName}
            />
          )}
        </m.div>
      );
    }

    if (message.role === "assistant") {
      return (
        <EnterOnce id={message.id} role="assistant">
          <div
            className={cn(
              "flex flex-col gap-6",
              playScenarioIntro && message.isScenario && "scenario-intro",
            )}
          >
            <ChatContentBlock
              rawData={message.content}
              characterName={message.characterName || ""}
              profileImage={message.profileImage || ""}
              isStreaming={message.isStreaming}
              isEditMode={isEditable}
              isNovelView={isNovelView}
              userName={userName}
              assetImageUrls={assetImageUrls}
              unlockedAssetIds={unlockedAssetIds}
              onUpdate={handleUpdate}
              // 시나리오는 캐릭터가 만든 응답이 아니라 지우거나 다시 만들 대상이 아니다.
              // 처리 함수를 받지 않았으면 버튼도 띄우지 않는다.
              onDelete={message.isScenario || !canDelete ? undefined : handleDelete}
              onRetry={
                message.isScenario || !onRetryMessage || !isStoredMessage
                  ? undefined
                  : handleRetry
              }
              onReport={
                message.isScenario || !onReportMessage || !isStoredMessage
                  ? undefined
                  : handleReport
              }
            />
            {/* 추천 답변은 응답을 다 받은 뒤에 붙인다. 받는 동안 붙이면 입력 중 표시 밑에 먼저 떠 버린다. */}
            {!message.isStreaming && onSuggestionSelect && (
              <AiSuggestedChat items={suggestions} onSelect={onSuggestionSelect} />
            )}
          </div>
        </EnterOnce>
      );
    }

    return (
      <EnterOnce id={message.id} role="user">
        <UserChatBubble
          text={message.content}
          isEditable={isEditable}
          isNovelView={isNovelView}
          userName={userName}
          onUpdate={handleUpdate}
          onDelete={canDelete ? handleDelete : undefined}
        />
      </EnterOnce>
    );
  },
  (previous, next) => {
    const isSameMessage =
      previous.message.id === next.message.id &&
      previous.message.role === next.message.role &&
      previous.message.content === next.message.content &&
      previous.message.isDissolving === next.message.isDissolving &&
      (previous.message.role !== "assistant" ||
        (next.message.role === "assistant" &&
          previous.message.characterName === next.message.characterName &&
          previous.message.profileImage === next.message.profileImage &&
          previous.message.isStreaming === next.message.isStreaming &&
          previous.message.isScenario === next.message.isScenario));

    return (
      isSameMessage &&
      previous.isEditable === next.isEditable &&
      previous.isNovelView === next.isNovelView &&
      previous.userName === next.userName &&
      previous.assetImageUrls === next.assetImageUrls &&
      previous.unlockedAssetIds === next.unlockedAssetIds &&
      previous.suggestions === next.suggestions &&
      previous.playScenarioIntro === next.playScenarioIntro &&
      previous.onSuggestionSelect === next.onSuggestionSelect &&
      previous.onUpdateMessage === next.onUpdateMessage &&
      previous.onDeleteMessage === next.onDeleteMessage &&
      previous.onRetryMessage === next.onRetryMessage &&
      previous.onReportMessage === next.onReportMessage
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
    isNovelView = false,
    userName,
    assetImageUrls,
    unlockedAssetIds,
    onUpdateMessage,
    onDeleteMessage,
    onRetryMessage,
    onReportMessage,
    suggestions = EMPTY_SUGGESTIONS,
    onSuggestionSelect,
    playScenarioIntro = false,
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

    // 내가 방금 보낸 말은 위로 스크롤해 둔 상태여도 바닥으로 내려가 보여 준다. followOnAppend 는
    // 이미 바닥 근처일 때만 따라가서, 보내도 화면 밖에 붙어 아무 일도 없는 것처럼 보였다.
    const lastMessageId = messages.at(-1)?.id;
    const previousLastMessageIdRef = useRef(lastMessageId);
    useLayoutEffect(() => {
      const previousLastId = previousLastMessageIdRef.current;
      previousLastMessageIdRef.current = lastMessageId;
      if (!hasScrolledToLatestRef.current || previousLastId === lastMessageId) {
        return;
      }

      const current = messagesRef.current;
      const previousIndex = current.findIndex(
        (message) => message.id === previousLastId,
      );
      // 이전 마지막 메시지가 사라졌다면(임시 말풍선 → 서버 이력 교체) 새로 보낸 것이 아니다.
      if (previousIndex === -1) return;

      const hasSentMessage = current
        .slice(previousIndex + 1)
        .some((message) => message.role === "user");
      if (hasSentMessage) virtualizer.scrollToEnd();
    }, [lastMessageId, virtualizer]);

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
                isNovelView={isNovelView}
                userName={userName}
                assetImageUrls={assetImageUrls}
                unlockedAssetIds={unlockedAssetIds}
                suggestions={
                  virtualMessage.index === lastAssistantIndex
                    ? suggestions
                    : EMPTY_SUGGESTIONS
                }
                playScenarioIntro={playScenarioIntro}
                onSuggestionSelect={onSuggestionSelect}
                onUpdateMessage={onUpdateMessage}
                onDeleteMessage={onDeleteMessage}
                onRetryMessage={onRetryMessage}
                onReportMessage={onReportMessage}
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
