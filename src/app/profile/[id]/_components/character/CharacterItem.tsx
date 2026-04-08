import React, { useRef, useState } from "react";
import Image from "next/image";
import { ModalLayout } from "@/components/ModalLayout";
import { ChatFill, Dots, Global, HeartFill } from "@/icons";
import { formatStatCount } from "@/lib/utils";

interface CharacterItemProps {
  chatCount: number;
  id: string;
  isPublic: boolean;
  languages: string[];
  likeCount: number;
  thumbnail: string;
  title: string;
}

const CharacterItem = ({
  chatCount,
  id,
  isPublic,
  languages,
  likeCount,
  thumbnail,
  title,
}: CharacterItemProps) => {
  // 상태 및 참조 변수
  const triggerRef = useRef(null);
  const [isModal, setIsModal] = useState(false);

  // 로직 및 핸들러
  const toggleIsModal = () => {
    setIsModal((prev) => !prev);
  };

  return (
    <article className="flex gap-4 cursor-pointer p-3 rounded-2xl hover:bg-card">
      <Image
        src={thumbnail}
        alt={`${title} 대표 이미지`}
        width={80}
        height={80}
        className="w-20 h-20 rounded-xl"
      />

      <div
        id="character-info-container"
        className="flex flex-1 flex-col justify-between"
      >
        <section className="flex flex-col gap-0.5">
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

              {isModal && (
                <ModalLayout
                  triggerRef={triggerRef}
                  onClose={toggleIsModal}
                  className="whitespace-nowrap"
                >
                  <menu className="flex flex-col gap-1">
                    <button
                      type="button"
                      className="text-left px-2.5 py-2 rounded-lg hover:bg-btn-hover"
                    >
                      수정하기
                    </button>
                    <button
                      type="button"
                      className="text-left px-2.5 py-2 rounded-lg hover:bg-btn-hover"
                    >
                      삭제하기
                    </button>
                  </menu>
                </ModalLayout>
              )}
            </div>
          </header>

          <footer className="flex gap-1 text-xs text-font-2">
            <span className="flex items-center gap-1">
              <ChatFill className="w-3.5 h-3.5" />
              {formatStatCount(chatCount)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <HeartFill className="w-3.5 h-3.5" />
              {formatStatCount(likeCount)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{isPublic ? "공개" : "비공개"}</span>
          </footer>
        </section>

        <aside className="flex items-center gap-1.5 text-font-2">
          <Global className="w-3.5 h-3.5" aria-label="지원 언어" />
          <ul className="flex gap-1">
            {languages.map((lang) => (
              <li
                key={lang}
                className="px-1.5 py-px text-[10px] rounded-sm border border-font-2 bg-card"
              >
                {lang}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
};

export default CharacterItem;
