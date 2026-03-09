import { ChatFill } from "@/icons";
import Logo from "@/icons/Logo";
import New from "@/icons/New";
import Image from "next/image";
import React from "react";

interface CharacterCardProps {
  cardHeight: number;
  isNew?: boolean;
  isOfficial?: boolean;
  char: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
  };
}

const CharacterCard = ({
  char,
  cardHeight,
  isNew = false,
  isOfficial = false,
}: CharacterCardProps) => {
  return (
    <div
      style={{ height: `${cardHeight}px` }}
      className="overflow-hidden bg-card rounded-xl w-44.5 flex flex-col shrink-0"
    >
      {/* 이미지 영역 */}
      <div className="relative w-full h-45 shrink-0 overflow-hidden rounded-t-xl">
        <Image src={char.img} alt={char.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-card to-transparent via-card/0.5" />
        <div className="bg-[rgba(0,0,0,0.6)] justify-center absolute right-2 gap-0.5 bottom-2 py-0.5 pl-1 pr-2 rounded-md flex text-font-2 items-center">
          <ChatFill className="w-4 h-4 translate-y-px" />
          <span className="text-sm font-medium">{char.chatCount}</span>
        </div>
        {isNew && (
          <New className="absolute top-2 left-2 opacity-80 rounded-md w-7.5 h-7.5" />
        )}
        {isOfficial && (
          <Logo className="absolute top-2 right-2 opacity-80 rounded-md w-7.5 h-7.5" />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="p-3 pt-2 flex flex-col gap-1.5 flex-1">
        <p className="text-font-1 text-sm font-bold truncate">{char.name}</p>
        <p className="text-font-2 text-xs line-clamp-2">{char.dec}</p>

        <div className="flex gap-0.75 w-full h-4.5 overflow-hidden flex-wrap">
          {char.tag.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="bg-border-main rounded-sm px-1 py-0.5 text-brand text-[10px] flex text-nowrap whitespace-nowrap shrink-0"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
