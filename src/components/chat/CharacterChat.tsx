"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import { cn } from "@/lib/utils";

interface CharacterChatProps {
  image: string;
  chatText: string;
  CharacterName: string;
  imageSize?: number;
  imageClassName?: string;
  bubbleClassName?: string;
  /** 소설로 보기. 프로필·말풍선 없이 `이름 | 대사` 한 문단으로 그린다. */
  isNovelView?: boolean;
  /**
   * 프로필이 비어 있을 때 빈 원 대신 마스코트 기본 이미지를 그린다. 제작 미리보기처럼 아직 올리지 않은 것이
   * 정상인 화면용이다. 채팅방은 프로필을 받는 중에도 비어 있으므로 켜지 않는다(빈 원으로 자리만 잡는다).
   */
  showFallbackWhenEmpty?: boolean;
}

const CharacterChat = ({
  CharacterName,
  chatText,
  image,
  imageSize = 36,
  imageClassName = "size-9",
  bubbleClassName = "rounded-[0px_16px_16px_16px]",
  isNovelView = false,
  showFallbackWhenEmpty = false,
}: CharacterChatProps) => {
  const t = useTranslations();

  if (isNovelView) {
    return (
      <article className="body-4 whitespace-pre-line text-speech">
        {CharacterName && `${CharacterName} | `}
        {chatText}
      </article>
    );
  }

  return (
    <article className="flex gap-2">
      {/* 프로필이 없거나 세계관 상세가 아직 오지 않았으면 빈 src 로 그리지 않는다 — next/image 가 매번 콘솔 에러를 낸다.
          받는 중 말풍선(ChatContentBlock)과 같은 빈 원으로 자리만 잡아, 이미지가 와도 줄이 흔들리지 않게 한다. */}
      {image || showFallbackWhenEmpty ? (
        <ResourceImage
          src={image}
          alt={t("chatUI.characterProfileAlt", { name: CharacterName })}
          width={imageSize}
          height={imageSize}
          unoptimized
          // 대사가 길어 줄이 늘어도 프로필이 좁아지지 않게 줄어들지 않는다. 글이 대신 아랫줄로 내려간다.
          className={cn("avatar-img shrink-0", imageClassName)}
          // 클래스 우선순위나 대체 이미지(ImageFallback)의 컨테이너 쿼리와 상관없이 크기가 흔들리지 않도록 인라인으로도 못 박는다.
          style={{
            width: imageSize,
            height: imageSize,
            minWidth: imageSize,
            maxWidth: imageSize,
          }}
        />
      ) : (
        <span
          className={cn("shrink-0 rounded-full bg-card", imageClassName)}
          aria-hidden
        />
      )}

      <div id="chat-bubble-container" className="body-4 min-w-0">
        {/* 이름은 세계관 상세가 도착해야 채워진다. 비어 있어도 한 줄 높이를 잡아 두어, 나중에 채워질 때
            말풍선이 아래로 밀리지 않게 한다. */}
        <span className="body-6 mb-1.5 block min-h-[1lh] text-font-1">
          {CharacterName}
        </span>
        <div
          // 여러 줄 대사의 줄바꿈을 살린다. 연속 공백은 한 칸으로 줄여 원문 들여쓰기가 말풍선을 벌리지 않게 한다.
          className={cn(
            "w-fit whitespace-pre-line bg-card px-3 py-2 text-speech",
            bubbleClassName,
          )}
        >
          {chatText}
        </div>
      </div>
    </article>
  );
};

// 스트리밍 중에는 응답 블록 전체가 프레임마다 다시 그려진다. 글이 그대로인 앞 블록은 건너뛴다.
export default React.memo(CharacterChat);
