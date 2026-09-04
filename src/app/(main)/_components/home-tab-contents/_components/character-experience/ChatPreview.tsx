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
    // md 미만: 전체 폭 + 반응형 수정 전과 동일한 높이(h-95, 380px)로 아래쪽에 쌓인다.
    // md 이상: 원래처럼 남는 폭을 채우며 오른쪽에 붙는다.
    <section className="relative pr-4 min-w-0 w-full h-95 shrink-0 rounded-bl-2xl rounded-br-2xl bg-darker flex flex-col overflow-hidden md:flex-1 md:h-full md:rounded-bl-none md:rounded-tr-2xl">

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
