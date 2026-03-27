import { ChatFill } from "@/icons";
import Logo from "@/icons/Logo";
import New from "@/icons/New";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagList from "./TagList";

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
    <Link
      href={`/characters/${char.name}`}
      style={{ height: `${cardHeight}px` }}
      className="group hover:cursor-pointer overflow-hidden bg-card rounded-xl w-44.5 flex flex-col shrink-0"
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
      <div className="p-3 pt-2 flex flex-col gap-1.5 flex-1 group-hover:bg-border-main transition-all duration-200 ease-in-out">
        <p className="text-font-1 text-sm font-medium truncate">{char.name}</p>
        <p className="text-font-2 text-xs line-clamp-2">{char.dec}</p>

        <TagList list={char.tag} />
      </div>
    </Link>
  );
};

export default CharacterCard;
