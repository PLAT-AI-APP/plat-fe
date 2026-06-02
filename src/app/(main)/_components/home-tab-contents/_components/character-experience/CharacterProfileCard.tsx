import { ChatFill } from "@/icons";
import Image from "next/image";
import React from "react";

interface CharacterProfileCardProps {
  index: number;
}

const CharacterProfileCard = ({ index }: CharacterProfileCardProps) => {
  return (
    <section className="relative min-w-86.75 bg-white w-95 h-full rounded-tl-2xl rounded-bl-2xl inline-flex flex-col justify-end items-start overflow-hidden">
      <Image
        src={"/images/sample.png"}
        alt=""
        width={100}
        height={100}
        className="object-cover w-full h-full absolute inset-0"
      />
      <header className="absolute left-0 bottom-0 self-stretch px-6 pt-9 pb-7 bg-linear-to-b from-black/0 via-black/80 to-black/100 rounded-bl-2xl flex flex-col justify-center items-start gap-1 w-full">
        <div className="inline-flex items-center gap-2.5">
          <h2 className="text-font-0 title-2">제목제목제목제목제목{index}</h2>
        </div>
        <p className="body-3 text-font-1 line-clamp-1">
          가나다라마바사아자차카타파나다라마바사아자차카타파하
        </p>

        {/* 태그 리스트 영역 */}
        <div className="inline-flex items-start gap-1">
          <span className="body-5 flex justify-center items-center">
            <span className="text-brand">#태그</span>
          </span>
          <span className="body-5 flex justify-center items-center">
            <span className="text-brand">#태그</span>
          </span>
          <span className="body-5 flex justify-center items-center">
            <span className="text-brand">#태그</span>
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
