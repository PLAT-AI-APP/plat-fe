"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChatFill, Dots } from "@/icons";
import { formatStatCount } from "@/lib/utils";
import CharacterMenuPopover from "@/components/popover/CharacterMenuPopover";
import { useRouter } from "next/navigation";

interface CharacterItemProps {
  chatCount: number;
  id: number;
  isPublic: boolean;
  tagList: string[];
  thumbnail: string;
  title: string;
  description: string;
}

const CharacterItem = ({
  chatCount,
  id,
  isPublic,
  tagList,
  // likeCount,
  thumbnail,
  title,
  description,
}: CharacterItemProps) => {
  const router = useRouter();

  // 상태 및 참조 변수
  const triggerRef = useRef(null);
  const [isModal, setIsModal] = useState(false);

  // 로직 및 핸들러
  const toggleIsModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModal((prev) => !prev);
  };

  const handleCardClick = () => {
    if (!isModal) {
      router.push(`/characters/${id}`);
    }
  };
  return (
    <article
      onClick={handleCardClick}
      className="flex gap-2 cursor-pointer px-3 py-2.5 rounded-2xl hover:bg-card"
    >
      {/* 캐릭터 image */}
      <Image
        src={thumbnail}
        alt={`${title} 대표 이미지`}
        width={82}
        height={82}
        className="w-20.5 h-20.5 rounded-xl"
      />

      <div
        id="character-info-container"
        className="flex flex-1 flex-col justify-between"
      >
        <section className="flex flex-col">
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{title}</h3>
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={toggleIsModal}
                aria-label="더보기 메뉴"
              >
                <Dots className="w-3.5 h-3.5 text-font-2" />
              </button>

              {/* 캐릭터 수정/삭제 popover */}
              {isModal && (
                <div onClick={(e) => e.stopPropagation()}>
                  <CharacterMenuPopover
                    onClose={() => setIsModal(false)}
                    triggerRef={triggerRef}
                    onDelete={() => null}
                    onEdit={() => null}
                  />
                </div>
              )}
            </div>
          </header>

          {/* 캐릭터의 설명 */}
          <p className="pr-5.5 text-xs text-font-2 whitespace-pre-line line-clamp-1">
            {description}
          </p>

          {/* 채팅 갯수, 공개/비공개 여부 */}
          <footer className="flex pt-1 pb-0.5 gap-1 text-xs text-font-2">
            <span className="flex items-center gap-1">
              <ChatFill className="w-3.5 h-3.5" />
              {formatStatCount(chatCount)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{isPublic ? "공개" : "비공개"}</span>
          </footer>
        </section>

        {/* 캐릭터의 태그 리스트 영역 */}
        <aside className="flex items-center gap-1.5 text-font-2">
          <ul className="flex gap-0.5">
            {tagList.map((tag, index) => (
              <li key={index} className="text-[11px] text-brand-dark">
                #{tag}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
};

export default CharacterItem;
