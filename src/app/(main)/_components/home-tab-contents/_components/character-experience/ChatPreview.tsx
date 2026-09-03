import React from "react";
import { ChatBubble, NarrativeBlock, ActionFooter } from "./SubComponents";
import { OfficialPreviewItem } from "@/api/home/getOfficialPreview";

interface ChatPreviewProps {
  item: OfficialPreviewItem;
}

/**
 * 캐릭터 실제 대사는 API에 없어(시나리오 개요 텍스트만 제공) 채팅 버블은
 * 여전히 예시용 정적 텍스트를 쓰고, 캐릭터 이름만 실제 캐릭터명으로 연결한다.
 * 첫 시나리오의 개요가 있으면 그 내용을 내레이션으로 보여준다.
 */
const ChatPreview = ({ item }: ChatPreviewProps) => {
  const narrative = item.scenarios[0]?.content;

  return (
    <section className="relative pr-4 flex-1 h-full min-w-0 bg-darker rounded-tr-2xl rounded-br-2xl flex flex-col overflow-hidden">
      <div
        id="preview-chat-container"
        className="w-full h-full p-9 inline-flex flex-col justify-start items-start gap-6"
      >
        <ChatBubble
          name={item.title}
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />

        {narrative && <NarrativeBlock content={narrative} />}

        <ChatBubble
          name={item.title}
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />
        <ChatBubble
          name={item.title}
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />
        <ChatBubble
          name={item.title}
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />
      </div>

      <ActionFooter isActive={item.remainingFreeChatCount > 0} />
    </section>
  );
};

export default ChatPreview;
