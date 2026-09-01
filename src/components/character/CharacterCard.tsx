import { ChatFill } from "@/icons";
import Logo from "@/icons/Logo";
import New from "@/icons/New";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagList from "./TagList";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

interface CharacterCardProps {
  isNew?: boolean;
  isOfficial?: boolean;
  char: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
  };
  className?: ClassValue;
  id: string;
}

const CharacterCard = ({
  char,
  // cardHeight,
  isNew = false,
  isOfficial = false,
  className,
  id,
}: CharacterCardProps) => {
  return (
    <Link
      href={`/characters/${id}`}
      className={cn(
        "group hover:cursor-pointer overflow-hidden rounded-xl flex flex-col shrink-0 transition-all duration-200 ease-in-out",
        "w-full min-w-43.75",
        className,
      )}
    >
      {/* 이미지 영역 */}
      <div className="relative w-full aspect-square shrink-0 overflow-hidden rounded-xl">
        <Image src={char.img} alt={char.name} fill className="object-cover" />
        {/* <div className="absolute inset-0 bg-linear-to-t from-card to-transparent via-card/0.5" /> */}
        <div className="bg-scrim/60 justify-center absolute right-2 gap-0.5 bottom-2 py-0.5 pl-1 pr-2 rounded-md flex text-font-2 items-center">
          <ChatFill className="w-4 h-4 translate-y-px" />
          <span className="body-4">{char.chatCount}</span>
        </div>
        {isNew && (
          <New className="absolute top-2 left-2 opacity-80 rounded-md w-7.5 h-7.5" />
        )}
        {isOfficial && (
          <Logo className="absolute top-2 right-2 opacity-80 rounded-md w-7.5 h-7.5" />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="px-1 pt-2 flex flex-col justify-between gap-1 flex-1 transition-all duration-200 ease-in-out">
        <div className="flex flex-col gap-1">
          <p className="text-font-1 title-3 truncate">{char.name}</p>
          <p className="text-font-2 body-4 line-clamp-2">{char.dec}</p>
        </div>

        <div className="flex flex-col gap-1">
          <TagList list={char.tag} />

          <p className="body-6 text-font-disabled">@흐물쟁이</p>
        </div>
      </div>
    </Link>
  );
};

export default CharacterCard;
