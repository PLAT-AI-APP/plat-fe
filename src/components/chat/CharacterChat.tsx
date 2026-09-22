"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import { splitActionSegments } from "@/lib/chatText";
import { cn } from "@/lib/utils";

interface CharacterChatProps {
  image: string;
  chatText: string;
  CharacterName: string;
  imageSize?: number;
  imageClassName?: string;
  bubbleClassName?: string;
}

const CharacterChat = ({
  CharacterName,
  chatText,
  image,
  imageSize = 36,
  imageClassName = "size-9",
  bubbleClassName = "rounded-[0px_16px_16px_16px]",
}: CharacterChatProps) => {
  const t = useTranslations();
  const segments = splitActionSegments(chatText);
  // `**행동**` 이 있을 때만 줄을 나눠 그린다. 없으면 예전과 똑같이 문자열 하나로 둬 다른 대사의 모양이 바뀌지 않는다.
  const hasAction = segments.some((segment) => segment.type === "action");

  return (
    <article className="flex gap-2">
      <ResourceImage
        src={image}
        alt={t("chatUI.characterProfileAlt", { name: CharacterName })}
        width={imageSize}
        height={imageSize}
        unoptimized
        className={cn("avatar-img", imageClassName)}
      />

      <div id="chat-bubble-container" className="body-5">
        {/* 이름은 세계관 상세가 도착해야 채워진다. 비어 있어도 한 줄 높이를 잡아 두어, 나중에 채워질 때
            말풍선이 아래로 밀리지 않게 한다. */}
        <span className="body-6 mb-1.5 block min-h-[1lh] text-font-1">
          {CharacterName}
        </span>
        <div
          className={cn(
            "w-fit bg-card px-3 py-2 text-font-1",
            hasAction && "flex flex-col gap-2",
            bubbleClassName,
          )}
        >
          {hasAction
            ? segments.map((segment, index) => (
                <p
                  key={index}
                  // 행동은 대사보다 한 단계 흐린 색으로 구분한다.
                  className={cn(segment.type === "action" && "text-font-2")}
                >
                  {segment.value}
                </p>
              ))
            : chatText}
        </div>
      </div>
    </article>
  );
};

// 스트리밍 중에는 응답 블록 전체가 프레임마다 다시 그려진다. 글이 그대로인 앞 블록은 건너뛴다.
export default React.memo(CharacterChat);
