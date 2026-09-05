import React from "react";
import type { OfficialPreviewItem } from "@/api/home/getOfficialPreview";
import { ChatBubble, NarrativeBlock, ActionFooter } from "./SubComponents";

interface ChatPreviewProps {
  item: OfficialPreviewItem;
}

/**
 * 우측 대화 미리보기.
 *
 * 폭은 부모 그리드의 열이 정한다(왼쪽 카드와 같은 비율로 함께 변한다).
 * 내용이 열 높이를 넘으면 잘리는 대신 이 영역 안에서만 스크롤된다.
 */
const ChatPreview = ({ item }: ChatPreviewProps) => {
  const scenarios = item.scenarios ?? [];

  return (
    <section className="relative flex h-95 w-full min-w-0 flex-col overflow-hidden rounded-b-2xl bg-darker md:h-full md:rounded-bl-none md:rounded-tr-2xl">
      <div
        id="preview-chat-container"
        className="inline-flex h-full w-full flex-col items-start justify-start gap-6 overflow-y-auto p-9 pr-4"
      >
        {scenarios.length > 0 ? (
          scenarios.map((scenario) => (
            <React.Fragment key={scenario.episodeNo}>
              <ChatBubble name={item.title} message={scenario.title} />
              <NarrativeBlock content={scenario.content} />
            </React.Fragment>
          ))
        ) : (
          <NarrativeBlock content={item.description} />
        )}
      </div>

      <ActionFooter isActive={item.remainingFreeChatCount > 0} />
    </section>
  );
};

export default ChatPreview;
