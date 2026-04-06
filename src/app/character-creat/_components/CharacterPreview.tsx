import ActiveButton from "@/components/ActiveButton";
import ChatForm from "@/components/chat/ChatForm";
import MessageList from "@/components/chat/MessageList";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { Asterisk, ImageIcon, SendFill } from "@/icons";
import { cn } from "@/lib/utils";
import { ChatMessageType } from "@/type/chat";
import React, { useState } from "react";

const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    id: "1",
    role: "assistant",
    characterName: "윤아",
    profileImage: "/images/sample.png",
    // .plat 포맷 적용: 대사 + 이미지 + 지문
    content: `"나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든."\n\n{{img:/images/sample.png}}\n\n*그녀는 환하게 웃으며\n 내 소매를 살짝 잡아끌었다.*`,
  },
  {
    id: "2",
    role: "user",
    // 유저 메시지도 대사 형식을 지켜주면 파서가 DIALOGUE 블록으로 인식합니다.
    content: `"나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든."`,
  },
];
const CharacterPreview = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_MESSAGES);

  const handleUpdateMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, content: newContent } : msg,
      ),
    );
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const { isScrolling, onScroll } = useScrollTimeout();

  const [msg, setMsg] = useState("");
  return (
    <section className="flex flex-col justify-between flex-1 min-w-0 max-h-[calc(100vh-156px)]">
      <div
        onScroll={onScroll}
        className={cn(
          "flex-1 overflow-y-auto px-4 custom-scrollbar hide-scrollbar-on-idle",
          isScrolling && "is-scrolling",
        )}
      >
        <MessageList
          messages={messages}
          isEditable={true}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="shrink-0 px-3 py-3 mt-1.75 bg-bg-darkest rounded-4xl border border-border-main"
      >
        <div className="flex gap-1.5 text-sm text-font-2">
          <button className="px-2.5 py-1.5 rounded-[20px] border border-border-main">
            캐릭터명
          </button>
          <button className="px-2.5 py-1.5 rounded-[20px] border border-border-main">
            사용자명
          </button>
        </div>
        <textarea
          rows={2}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="메시지 보내기"
          className="mb-2 mt-3 w-full text-sm placeholder:text-font-disabled outline-none"
        />

        <div className="flex justify-between">
          <div className="flex gap-2 text-sm text-font-2">
            <button
              type="button"
              className="flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 rounded-[100px] border border-border-main bg-[#171D28]/50 "
            >
              <Asterisk className="w-4 h-4" />
              상황
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 rounded-[100px] border border-border-main bg-[#171D28]/50 "
            >
              <ImageIcon className="w-4 h-4" /> 에셋
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 rounded-[100px] border border-border-main bg-[#171D28]/50 "
            >
              {`{user}`}
            </button>
          </div>

          <ActiveButton
            isActive={msg.length > 0}
            text=""
            type="submit"
            className="w-8.5 h-8.5 flex items-center justify-center rounded-full"
          >
            <SendFill className="w-4.5 h-4.5" />
          </ActiveButton>
        </div>
      </form>
    </section>
  );
};

export default CharacterPreview;
