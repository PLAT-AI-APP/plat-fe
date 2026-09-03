import { ChatFill } from "@/icons";
import Image from "next/image";
import React from "react";
import { OfficialPreviewItem } from "@/api/home/getOfficialPreview";

interface CharacterProfileCardProps {
  item: OfficialPreviewItem;
}

const CharacterProfileCard = ({ item }: CharacterProfileCardProps) => {
  return (
    <section className="relative min-w-86.75 w-95 h-full overflow-hidden rounded-l-2xl bg-scrim inline-flex flex-col justify-end items-start">
      <Image
        src={item.images[0]}
        alt={item.title}
        width={100}
        height={100}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <header className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-center gap-1 self-stretch bg-linear-to-b from-scrim/0 via-scrim/80 to-scrim px-6 pb-7 pt-9">
        <div className="inline-flex items-center gap-2.5">
          <h2 className="text-font-0 title-2 line-clamp-1">{item.title}</h2>
        </div>
        <p className="body-3 text-font-1 line-clamp-1">{item.description}</p>

        {/* 태그 리스트 영역 */}
        {item.tags.length > 0 && (
          <div className="inline-flex items-start gap-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="body-5 flex justify-center items-center"
              >
                <span className="text-font-2">#{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* 대화수 정보 */}
        <div className="inline-flex justify-center items-center gap-[4.86px]">
          <ChatFill className="size-4 text-font-2" />
          <span className="text-font-2 body-5">{item.chatCount}</span>
        </div>
      </header>
    </section>
  );
};

export default CharacterProfileCard;
