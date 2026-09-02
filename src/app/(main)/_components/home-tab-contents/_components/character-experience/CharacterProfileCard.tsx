import { ChatFill } from "@/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface CharacterProfileCardProps {
  index: number;
  isStacked?: boolean;
}

const CharacterProfileCard = ({
  index,
  isStacked = false,
}: CharacterProfileCardProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-scrim inline-flex flex-col justify-end items-start",
        isStacked
          ? "w-full h-56 shrink-0 rounded-t-2xl"
          : "min-w-86.75 w-95 h-full rounded-l-2xl",
      )}
    >
      <Image
        src={`https://picsum.photos/seed/character-experience-${index}/200/300`}
        alt=""
        width={100}
        height={100}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <header className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-center gap-1 self-stretch bg-linear-to-b from-scrim/0 via-scrim/80 to-scrim px-6 pb-7 pt-9">
        <div className="inline-flex items-center gap-2.5">
          <h2 className="text-font-0 title-2">제목제목제목제목제목{index}</h2>
        </div>
        <p className="body-3 text-font-1 line-clamp-1">
          가나다라마바사아자차카타파나다라마바사아자차카타파하
        </p>

        {/* 태그 리스트 영역 */}
        <div className="inline-flex items-start gap-1">
          <span className="body-5 flex justify-center items-center">
            <span className="text-font-2">#태그</span>
          </span>
          <span className="body-5 flex justify-center items-center">
            <span className="text-font-2">#태그</span>
          </span>
          <span className="body-5 flex justify-center items-center">
            <span className="text-font-2">#태그</span>
          </span>
        </div>

        {/* 대화수 정보 */}
        <div className="inline-flex justify-center items-center gap-[4.86px]">
          <ChatFill className="size-4 text-font-2" />
          <span className="text-font-2 body-5">235</span>
        </div>
      </header>
    </section>
  );
};

export default CharacterProfileCard;
