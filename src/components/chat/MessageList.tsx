import React, { memo } from "react";
import { ChatMessageType } from "@/type/chat";
import AiSuggestedChat from "./AiSuggestedChat";
import ChatContentBlock from "./ChatContentBlock";
import UserChatBubble from "./UserChatBubble";

interface MessageListProps {
  messages: ChatMessageType[];
  isEditable?: boolean;
  onUpdateMessage?: (id: string, newContent: string) => void;
  onDeleteMessage?: (id: string) => void;
  isAiSuggestedChat?: boolean;
}

const MessageList = memo(
  ({
    messages,
    isEditable = false,
    onUpdateMessage,
    onDeleteMessage,
    isAiSuggestedChat = true,
  }: MessageListProps) => {
    // 마지막 AI 답변 아래에 추천 응답을 이어 붙이는 기준
    const lastAssistantIndex = messages.reduce(
      (lastIndex, message, index) =>
        message.role === "assistant" ? index : lastIndex,
      -1,
    );

    return (
      <section
        id="chat-message-list"
        className="flex flex-1 flex-col gap-6 px-4 pb-6"
      >
        {messages.map((msg, index) => (
          <article key={msg.id}>
            {msg.role === "assistant" ? (
              <div className="flex flex-col gap-6">
                <ChatContentBlock
                  rawData={msg.content}
                  characterName={msg.characterName || ""}
                  profileImage={msg.profileImage || ""}
                  isEditMode={isEditable}
                  onUpdate={(newContent) => onUpdateMessage?.(msg.id, newContent)}
                  onDelete={() => onDeleteMessage?.(msg.id)}
                />
                {index === lastAssistantIndex && isAiSuggestedChat && (
                  <AiSuggestedChat />
                )}
              </div>
            ) : (
              <UserChatBubble
                text={msg.content}
                isEditable={isEditable}
                onUpdate={(newContent) => onUpdateMessage?.(msg.id, newContent)}
                onDelete={() => onDeleteMessage?.(msg.id)}
              />
            )}
          </article>
        ))}
      </section>
    );
  },
);

MessageList.displayName = "MessageList";

export default MessageList;
