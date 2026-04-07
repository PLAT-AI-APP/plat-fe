import React, { memo } from "react";
import ChatContentBlock from "./ChatContentBlock";
import UserChatBubble from "./UserChatBubble";
import { ChatMessageType } from "@/type/chat";
import AiSuggestedChat from "./AiSuggestedChat";

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
    return (
      <section
        id="chat-message-list"
        className="flex-1 overflow-y-auto flex flex-col gap-6"
      >
        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;

          return (
            <article key={msg.id}>
              {msg.role === "assistant" ? (
                <div className="flex flex-col gap-6">
                  <ChatContentBlock
                    rawData={msg.content}
                    characterName={msg.characterName || ""}
                    profileImage={msg.profileImage || ""}
                    isEditMode={isEditable}
                    onUpdate={(newContent) =>
                      onUpdateMessage?.(msg.id, newContent)
                    }
                    onDelete={() => onDeleteMessage?.(msg.id)}
                  />
                  {isLastMessage && isAiSuggestedChat && <AiSuggestedChat />}
                </div>
              ) : (
                <UserChatBubble
                  text={msg.content}
                  isEditable={isEditable}
                  onUpdate={(newContent) =>
                    onUpdateMessage?.(msg.id, newContent)
                  }
                  onDelete={() => onDeleteMessage?.(msg.id)}
                />
              )}
            </article>
          );
        })}
      </section>
    );
  },
);

MessageList.displayName = "MessageList";
export default MessageList;
