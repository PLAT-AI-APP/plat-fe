"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import Header from "./Header";
import CharacterGrid from "@/components/character/CharacterGrid";
import { Sort } from "@/icons";
import CharacterSortPopover from "@/components/popover/CharacterSortPopover";
import useToggle from "@/hooks/useToggle";

const CharArray = [
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을",
    tag: ["학교", "일상", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을",
    tag: ["학교", "일상", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
];

export default function ProfileContent({ id }: { id: string }) {
  // 상태 및 참조 변수
  const [sort, setSort] = useState<"최신순" | "채팅순">("최신순");
  const { isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <article className="@container flex flex-col gap-11.5 px-10 pt-7.5">
      {/* 사용자 프로필 정보 요약 영역 */}
      <Header userId={id} />

      {/* 탭 메뉴 및 콘텐츠 영역 */}
      <section
        id="profile-content"
        className="flex-1 flex flex-col gap-2 min-w-0 h-full rounded-3xl"
      >
        <header
          className={cn(
            "flex justify-between text-sm text-font-2 px-2.5 py-1.5",
          )}
        >
          작품목록 2
          <div id="sort-filter-container" className="relative">
            <button
              ref={triggerRef}
              type="button"
              onClick={toggle}
              className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <Sort className="w-3.5 h-3.5" />
              {sort}
            </button>

            {isOpen && (
              <CharacterSortPopover
                onChange={setSort}
                onClose={toggle}
                triggerRef={triggerRef as React.RefObject<HTMLButtonElement>}
                value={sort}
              />
            )}
          </div>
        </header>

        <section
          id="character-list-section"
          className="w-full h-auto flex flex-col gap-4 justify-center"
        >
          <CharacterGrid
            char={CharArray}
            // lineCount={2}
            cardHeight={280.67}
            rowGap={12}
            columnGap={12}
          />
        </section>
      </section>
    </article>
  );
}
