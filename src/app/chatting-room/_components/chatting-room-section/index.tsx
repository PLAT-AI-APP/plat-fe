"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useChatModelsQuery } from "@/api/chat/getChatModels";
import { useDeleteRoomMessageMutation } from "@/api/room/deleteRoomMessage";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import {
  isMessageAtOrAfter,
  useRoomMessagesInfiniteQuery,
} from "@/api/room/getRoomMessages";
import { useUniverseDetailQuery } from "@/api/universe/getUniverseDetail";
import ChatForm, { type ChatFormHandle } from "@/components/chat/ChatForm";
import MessageList from "@/components/chat/MessageList";
import SkeletonChatMessages from "@/components/skeleton/SkeletonChatMessages";
import { ErrorState } from "@/components/state";
import { Info } from "@/icons";
import { useChatTurn } from "@/hooks/chat/useChatTurn";
import { useStoredChatModel } from "@/hooks/chat/useStoredChatModel";
import { useIntersectionObserver } from "@/hooks/dom/useIntersectionObserver";
import { useScrollTimeout } from "@/hooks/dom/useScrollTiemout";
import { toAiModel } from "@/lib/chatModel";
import { toImageVariantUrl } from "@/lib/file";
import { useChatViewStore } from "@/store/useChatViewStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
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
  const { onScroll } = useScrollTimeout();
  const isNovelView = useChatViewStore((state) => state.isNovelView);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const handleScrollContainerRef = useCallback((element: HTMLDivElement | null) => {
    scrollContainerRef.current = element;
    setScrollContainer(element);
  }, []);

  const t = useTranslations();
  const {
    data: room,
    isError: isRoomError,
    error: roomError,
    refetch: refetchRoom,
  } = useRoomDetailQuery(roomId);
  // 캐릭터(세계관)가 지워졌거나 운영 심사 중인 방은 세계관 상세가 닫혀 있어 부르지 않는다(404).
  // 이름은 방에 남긴 스냅샷을, 캐릭터 ID·프로필은 방 응답의 값을 쓴다.
  const isClosed = room?.closed === true;
  const isHandoverPending = room?.handoverPending === true;
  const isUniverseOpen = !isClosed && !isHandoverPending;
  const { data: universe, isError: isUniverseError } = useUniverseDetailQuery(
    isUniverseOpen ? room?.universeId : undefined,
  );
  // 방을 받기 전에는 세계관 쿼리가 꺼져 있어 isLoading 이 false 이므로, 데이터 유무로 판단한다.
  const isCharacterLoading = isUniverseOpen && !universe && !isUniverseError;
  const characterName = universe?.character.name ?? room?.characterName ?? "";
  const openModal = useModalStore((state) => state.openModal);
  // 신고 모달은 목록 밖에서 열리므로 함수가 매 렌더 바뀌면 메시지 행이 전부 다시 그려진다.
  const handleReportMessage = useCallback(
    (messageId: string) =>
      openModal("REPORT", { targetType: "MESSAGE", targetId: messageId, targetName: characterName }),
    [openModal, characterName],
  );
  // 말풍선 아바타는 36px 이라 원본 대신 정사각 140px 변형본이면 충분하다(2배 화면 기준 72px 이상).
  const profileImage =
    toImageVariantUrl(
      room?.characterProfileImageUrl ?? universe?.character.profileImageUrl,
      "sq140",
    ) ?? "";

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

  // 페이지는 최신 → 과거 순이고 페이지 안은 시간순이다. 페이지 순서만 뒤집어야 전체가 시간순이 된다.
  // (메시지 단위로 뒤집으면 한 턴 안에서 캐릭터 응답이 내가 보낸 말 위로 올라간다.)
  const serverMessages = useMemo<ChatMessageType[]>(() => {
    const messages = [...(data?.pages ?? [])]
      .reverse()
      .flatMap((page) => page.content)
      .map((message) => toChatMessage(message, characterName, profileImage));

    // 방을 만들면 서버가 시나리오 내용을 첫 AI 메시지로 저장한다. 사용자는 늘 먼저 말을 거므로
    // 이력 맨 앞(더 불러올 과거가 없을 때)의 AI 메시지는 시나리오다.
    const [firstMessage] = messages;
    if (!hasNextPage && firstMessage?.role === "assistant") {
      messages[0] = { ...firstMessage, isScenario: true };
    }

    return messages;
  }, [data, hasNextPage, characterName, profileImage]);

  const { data: chatCatalog, isPending: isModelsPending } = useChatModelsQuery();
  const models = useMemo(
    () => chatCatalog?.models.map(toAiModel) ?? [],
    [chatCatalog],
  );
  // 서버에 방별 모델 저장이 없어 브라우저에 기억한다. 고른 적이 없거나 그 모델이 카탈로그에서
  // 빠졌으면 목록 첫 모델을 쓴다.
  const { selectedModelId, selectModel } = useStoredChatModel(roomId);
  const currentAi = models.find((model) => model.id === selectedModelId) ?? models[0];

  const handleCurrentAi = useCallback(
    (model: AIModelType) => {
      selectModel(model.id);
    },
    [selectModel],
  );

  const chatFormRef = useRef<ChatFormHandle>(null);
  const handleTurnFailed = useCallback((message: string) => {
    chatFormRef.current?.restore(message);
  }, []);
  // 고른 추천은 입력창에 넣기만 한다. 바로 보내면 고쳐 쓸 틈이 없다.
  const handleSuggestionSelect = useCallback((text: string) => {
    chatFormRef.current?.fill(text);
  }, []);

  // 진행 중인 턴의 말풍선은 서버 이력과 별개로 이어붙이고, 저장이 끝나 이력에 들어오면 훅이 치운다.
  const {
    pendingMessages,
    replacingFromMessageId,
    suggestions,
    isBusy,
    canSend,
    sendMessage,
    regenerateMessage,
  } = useChatTurn({
    roomId,
    universeCharacterId:
      room?.universeCharacterId ?? universe?.character.universeCharacterId,
    personaId: room?.personaId,
    modelId: currentAi?.id,
    multiplier: room?.multiplier,
    characterName,
    profileImage,
    onTurnFailed: handleTurnFailed,
  });
  // 다시 만드는 중인 옛 답과 그 뒤 대화는 가리고(확정되면 서버가 지운다), 목록 끝에 새로 받는 답을 잇는다.
  const messages = useMemo(() => {
    const visible = replacingFromMessageId
      ? serverMessages.filter(
          (message) => !isMessageAtOrAfter(message.id, replacingFromMessageId),
        )
      : serverMessages;
    return [...visible, ...pendingMessages];
  }, [serverMessages, pendingMessages, replacingFromMessageId]);

  const openDialog = useDialogStore((state) => state.openDialog);
  const { mutate: deleteRoomMessage } = useDeleteRoomMessageMutation();
  // 답을 만드는 동안에는 지우거나 다시 만들 수 없다(서버도 409). 버튼을 거둬 헛누름을 막는다.
  const handleDeleteMessage = useCallback(
    (messageId: string) =>
      openDialog("CHAT_TURN_DELETE", {
        onConfirm: () => deleteRoomMessage({ roomId, messageId }),
      }),
    [openDialog, deleteRoomMessage, roomId],
  );
  // 마지막 답은 바로 다시 만든다. 중간 답은 확정되면 뒤 대화가 모두 지워지므로 먼저 묻는다.
  const lastServerMessageId = serverMessages.at(-1)?.id;
  const handleRetryMessage = useCallback(
    (messageId: string) => {
      if (messageId === lastServerMessageId) {
        regenerateMessage(messageId);
        return;
      }
      openDialog("CHAT_TURN_REGENERATE", {
        onConfirm: () => regenerateMessage(messageId),
      });
    },
    [lastServerMessageId, regenerateMessage, openDialog],
  );

  const handleLoadOlderMessages = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { targetRef: topSentinelRef } = useIntersectionObserver({
    onIntersect: handleLoadOlderMessages,
    // 여기서는 위로 올릴수록 과거를 부른다. 기본값(아래쪽 여유)과 반대다.
    rootMargin: "600px 0px 0px 0px",
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
          className="relative flex-1 overflow-y-auto hide-scrollbar-on-idle"
        >
          <ChattingRoomHeader
            roomId={roomId}
            // 세계관 상세가 닫힌 방은 제목을 링크로 두지 않는다.
            universeId={isUniverseOpen ? room?.universeId : undefined}
            characterName={characterName}
            models={models}
            currentAi={currentAi}
            isCharacterLoading={isCharacterLoading}
            isModelsLoading={isModelsPending}
            handleCurrentAi={handleCurrentAi}
          />
          <ChattingRoomNotice />

          {hasNextPage && (
            <div ref={topSentinelRef} aria-hidden="true" className="h-px" />
          )}

          {isMessagesPending ? (
            <SkeletonChatMessages />
          ) : isMessagesError && serverMessages.length === 0 ? (
            <ErrorState error={messagesError} onRetry={refetchMessages} />
          ) : (
            <MessageList
              messages={messages}
              scrollContainer={scrollContainer}
              isNovelView={isNovelView}
              suggestions={suggestions}
              onSuggestionSelect={handleSuggestionSelect}
              onDeleteMessage={isBusy ? undefined : handleDeleteMessage}
              onRetryMessage={isBusy || !canSend || isClosed ? undefined : handleRetryMessage}
              // 지워진 캐릭터의 답은 신고할 대상이 사라졌다.
              onReportMessage={isClosed ? undefined : handleReportMessage}
            />
          )}
        </div>

        {/* 메시지 목록이 px-4 를 쓰므로 입력창도 같은 여백을 써야 줄이 맞는다. */}
        <div className="shrink-0 bg-dark px-4 py-4">
          {isClosed ? (
            <p
              role="status"
              className="body-4 rounded-xl bg-darkest px-4 py-4 text-center text-font-2"
            >
              {t("chatRoom.closedNotice")}
            </p>
          ) : (
            <>
              {isHandoverPending && (
                <p
                  role="status"
                  className="body-7 mx-auto mb-3 flex w-fit max-w-full items-center gap-1.5 rounded-full bg-info-bg px-3 py-1.5 text-info"
                >
                  <Info className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{t("chatRoom.handoverPendingNotice")}</span>
                </p>
              )}
              <ChatForm
              ref={chatFormRef}
              onSendMessage={sendMessage}
              disabled={isBusy}
              isPreparing={!canSend && !isRoomError && !isUniverseError}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChattingRoomSection;
