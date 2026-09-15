"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
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
      <Image
        src={image}
        alt={t("chatUI.characterProfileAlt", { name: CharacterName })}
        width={imageSize}
        height={imageSize}
        unoptimized
        className={cn("avatar-img", imageClassName)}
      />

      <div id="chat-bubble-container" className="body-5">
        <span className="body-6 mb-1.5 block text-font-1">{CharacterName}</span>
        <div
          className={cn(
            "w-fit bg-card px-3 py-2 text-font-1",
            bubbleClassName,
          )}
        >
          {chatText}
        </div>
      </div>
    </article>
  );
};

export default CharacterChat;
