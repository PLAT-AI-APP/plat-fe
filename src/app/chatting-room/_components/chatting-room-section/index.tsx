"use client";

import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ChatForm from "@/components/chat/ChatForm";
import MessageList from "@/components/chat/MessageList";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { cn } from "@/lib/utils";
import { AIModelType, ChatMessageType } from "@/type/chat";
import ChattingRoomHeader from "./ChattingRoomHeader";
import ChattingRoomNotice from "./ChattingRoomNotice";

const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    id: "assistant-1",
    role: "assistant",
    characterName: "캐릭터 이름",
    profileImage: "/images/sample.png",
    content:
      `"어쩌구 저쩌구 ~~~~" {img:/images/sample.png} ` +
      "신이 문을 열고 들어오는 찰나, 연우는 숨을 멈춘 채로 굳어버렸다. 방 안에는 방금 전까지 아무 일도 없었던 것처럼 고요가 내려앉아 있었다.\n\n" +
      "잠깐의 정적 끝에, 연우는 천천히 시선을 들어 상대를 바라보았다.",
  },
  {
    id: "user-1",
    role: "user",
    content: "가나다라마바사아자차카타파하",
  },
];

const ChattingRoomSection = () => {
  const t = useTranslations();
  const { isScrolling, onScroll } = useScrollTimeout();
  const [messages, setMessages] =
    useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [isSuggestedReplyOn, setIsSuggestedReplyOn] = useState(true);
  const [currentAi, setCurrentAi] = useState<AIModelType>({
    id: "Claude Opus 4.6",
    name: "Opus 4.6",
    description: t("chatUI.claudeOpus46Description"),
    price: 1.2,
    unit: t("chatUI.perChat"),
    icon: "/ai-logo/claude.png",
  });

  const handleCurrentAi = useCallback((model: AIModelType) => {
    setCurrentAi(model);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    // 즉시 말풍선으로 이어지는 사용자 입력 상태
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmedMessage,
      },
    ]);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    // AI 응답 하단 삭제 액션에서 해당 메시지를 목록에서 제거
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId),
    );
  }, []);

  const handleRetryMessage = useCallback((messageId: string) => {
    // 재생성 API 연결 전까지는 같은 응답을 유지하며 다시하기 액션 자리만 보존
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message } : message,
      ),
    );
  }, []);

  return (
    <section className="flex h-full min-h-0 flex-1 justify-center bg-dark pt-2">
      <div className="flex h-full w-full max-w-[867px] flex-col">
        <div
          onScroll={onScroll}
          className={cn(
            "relative flex-1 overflow-y-auto hide-scrollbar-on-idle",
            isScrolling && "is-scrolling",
          )}
        >
          <ChattingRoomHeader
            characterName="캐릭터 이름"
            currentAi={currentAi}
            handleCurrentAi={handleCurrentAi}
            isSuggestedReplyOn={isSuggestedReplyOn}
            onSuggestedReplyToggle={() =>
              setIsSuggestedReplyOn((prevState) => !prevState)
            }
          />
          <ChattingRoomNotice />
          <MessageList
            messages={messages}
            isAiSuggestedChat={isSuggestedReplyOn}
            onDeleteMessage={handleDeleteMessage}
            onRetryMessage={handleRetryMessage}
          />
        </div>

        <div className="shrink-0 bg-dark py-4">
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      </div>
    </section>
  );
};

export default ChattingRoomSection;
