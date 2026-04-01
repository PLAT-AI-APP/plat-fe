import React, { memo } from "react";
import ChatContentBlock from "./ChatContentBlock";
import UserChatBubble from "./UserChatBubble";
import { ChatMessageType } from "@/type/chat";

const MessageList = memo(({ messages }: { messages: ChatMessageType[] }) => {
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
              <ChatContentBlock
                rawData={msg.content}
                characterName={msg.characterName || ""}
                profileImage={msg.profileImage || ""}
                showSuggestions={isLastMessage}
              />
            ) : (
              <UserChatBubble text={msg.content} />
            )}
          </article>
        );
      })}
    </section>
  );
});

MessageList.displayName = "MessageList";
export default MessageList;
