"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CharacterShowcase from "@/app/(main)/_components/CharacterShowcase";
import CharacterSortPopover, {
  CharacterSortOption,
} from "@/components/popover/CharacterSortPopover";
import useToggle from "@/hooks/useToggle";
import { Sort } from "@/icons";
import Header from "./Header";

const CharArray = [
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "매일 학교에서 일어나는 소소한 일상을 함께 이야기해요.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "장난스럽지만 속은 다정한 캐릭터와 대화를 나눠보세요.",
    tag: ["학교", "일상", "친구", "로맨스"],
    img: "https://picsum.photos/201/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "무심한 듯 챙겨주는 친구와 이어지는 이야기입니다.",
    tag: ["학교", "일상", "친구", "청춘"],
    img: "https://picsum.photos/202/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상"],
    img: "https://picsum.photos/203/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "가볍게 대화하기 좋은 캐릭터입니다.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/204/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "친구처럼 편하게 말을 걸어주는 캐릭터입니다.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/205/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "짧은 대화에도 자연스럽게 이어지는 캐릭터입니다.",
    tag: ["학교", "일상", "친구"],
    img: "https://picsum.photos/206/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "학교생활의 여러 순간을 함께 나누는 캐릭터입니다.",
    tag: ["학교", "일상"],
    img: "https://picsum.photos/207/300",
  },
];

export default function ProfileContent({ id }: { id: string }) {
  const t = useTranslations();
  const [sort, setSort] = useState<CharacterSortOption>("latest");
  const { isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <article className="@container mx-auto flex max-w-300 flex-col gap-11.5 px-10 pt-7.5 pb-11.25">
      <Header userId={id} />

      <section
        id="profile-content"
        className="flex min-w-0 flex-1 flex-col gap-3.5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <nav className="flex w-full items-end border-b-2 border-card-hover">
            <button
              type="button"
              className="title-3 flex w-[102px] items-center justify-center border-b-2 border-brand px-5 py-2.5 text-center text-font-1"
            >
              {t("profile.characterTab")}
            </button>
            <button
              type="button"
              disabled
              className="body-2 flex w-[102px] cursor-default items-center justify-center px-5 py-2.5 text-center text-font-disabled"
            >
              -
            </button>
          </nav>

          <header className="flex w-full items-center justify-between">
            <div className="title-5 flex items-center gap-1 text-font-2">
              <span>{t("profile.worksList")}</span>
              <span>{CharArray.length}</span>
            </div>

            <div id="sort-filter-container" className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={toggle}
                className="title-5 flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-font-2"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
              >
                <Sort className="size-4" />
                {t(`profile.sort.${sort}`)}
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
        </div>

        <section
          id="character-list-section"
          className="flex h-auto w-full flex-col justify-center gap-4"
        >
          <CharacterShowcase
            charArray={CharArray}
            cardSize="S"
            rowGap={12}
            columnGap={12}
          />
        </section>
      </section>
    </article>
  );
}
