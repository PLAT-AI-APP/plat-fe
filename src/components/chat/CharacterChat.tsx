"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

interface CharacterChatProps {
  image: string;
  chatText: string;
  CharacterName: string;
}

const CharacterChat = ({
  CharacterName,
  chatText,
  image,
}: CharacterChatProps) => {
  const t = useTranslations();

  return (
    <article className="flex gap-2">
      <Image
        src={image}
        alt={t("chatUI.characterProfileAlt", { name: CharacterName })}
        width={36}
        height={36}
        className="avatar-img size-9"
      />

      <div id="chat-bubble-container" className="body-5">
        <span className="body-6 mb-1.5 block text-font-1">{CharacterName}</span>
        <div className="w-fit rounded-[0px_16px_16px_16px] bg-card px-3 py-2 text-font-1">
          {chatText}
        </div>
      </div>
    </article>
  );
};

export default CharacterChat;
