"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import ActionText from "@/components/chat/ActionText";
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

  return (
    <article className="flex gap-2">
      {/* 프로필이 없거나 세계관 상세가 아직 오지 않았으면 빈 src 로 그리지 않는다 — next/image 가 매번 콘솔 에러를 낸다.
          받는 중 말풍선(ChatContentBlock)과 같은 빈 원으로 자리만 잡아, 이미지가 와도 줄이 흔들리지 않게 한다. */}
      {image ? (
        <ResourceImage
          src={image}
          alt={t("chatUI.characterProfileAlt", { name: CharacterName })}
          width={imageSize}
          height={imageSize}
          unoptimized
          className={cn("avatar-img", imageClassName)}
        />
      ) : (
        <span
          className={cn("shrink-0 rounded-full bg-card", imageClassName)}
          aria-hidden
        />
      )}

      <div id="chat-bubble-container" className="body-5">
        {/* 이름은 세계관 상세가 도착해야 채워진다. 비어 있어도 한 줄 높이를 잡아 두어, 나중에 채워질 때
            말풍선이 아래로 밀리지 않게 한다. */}
        <span className="body-6 mb-1.5 block min-h-[1lh] text-font-1">
          {CharacterName}
        </span>
        <div
          className={cn("w-fit bg-card px-3 py-2 text-font-1", bubbleClassName)}
        >
          <ActionText text={chatText} />
        </div>
      </div>
    </article>
  );
};

// 스트리밍 중에는 응답 블록 전체가 프레임마다 다시 그려진다. 글이 그대로인 앞 블록은 건너뛴다.
export default React.memo(CharacterChat);
