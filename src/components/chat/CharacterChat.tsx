import Image from "next/image";
import React from "react";

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
  return (
    <article className="flex gap-2">
      <Image
        src={image}
        alt={`${CharacterName} 프로필 이미지`}
        width={40}
        height={40}
        className="rounded-full w-10 h-10"
      />
      <div id="chat-bubble-container" className="text-sm font-medium">
        <span className="block">{CharacterName}</span>
        <div className="w-fit mt-1.5 px-3 py-2 bg-card rounded-[0px_16px_16px_16px]">
          {chatText}
        </div>
      </div>
    </article>
  );
};

export default CharacterChat;
