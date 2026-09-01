"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CharacterShowcase from "@/app/(main)/_components/CharacterShowcase";
import CharacterSortPopover, {
  CharacterSortOption,
} from "@/components/popover/CharacterSortPopover";
import useToggle from "@/hooks/useToggle";
import { useTabUnderline } from "@/hooks/useTabUnderline";
import { Sort } from "@/icons";
import { cn } from "@/lib/utils";
import Header from "./Header";
import { SPRING_SNAPPY } from "@/constants/motion";

type ProfileTab = "character" | "wish";

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

const WishArray = [
  {
    name: "밤하늘의 약속",
    chatCount: 87,
    dec: "별을 보며 나눈 이야기를 잊지 않는 캐릭터입니다.",
    tag: ["판타지", "감성"],
    img: "https://picsum.photos/210/300",
  },
  {
    name: "카페 사장 리나",
    chatCount: 54,
    dec: "단골손님을 반갑게 맞아주는 카페 사장님입니다.",
    tag: ["일상", "힐링"],
    img: "https://picsum.photos/211/300",
  },
  {
    name: "탐정 조수 케이",
    chatCount: 210,
    dec: "사건을 함께 추리하며 실마리를 찾아가는 조수입니다.",
    tag: ["미스터리", "추리"],
    img: "https://picsum.photos/212/300",
  },
];

const TAB_ITEMS: { key: ProfileTab; labelKey: string }[] = [
  { key: "character", labelKey: "profile.characterTab" },
  { key: "wish", labelKey: "profile.wishTab" },
];

export default function ProfileContent({ id }: { id: string }) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<ProfileTab>("character");
  const [sort, setSort] = useState<CharacterSortOption>("latest");
  const { isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const {
    containerRef: tabNavRef,
    setTabRef,
    rect: underlineRect,
  } = useTabUnderline(activeTab);

  const displayArray = activeTab === "character" ? CharArray : WishArray;

  return (
    <article className="@container mx-auto flex w-[1200px] max-w-full flex-col gap-10 pt-6 pb-10">
      <Header userId={id} />

      <section
        id="profile-content"
        className="flex min-w-0 flex-1 flex-col gap-3.5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <nav
            ref={tabNavRef as React.RefObject<HTMLElement>}
            className="relative flex w-full items-end border-b-2 border-card-hover"
          >
            {TAB_ITEMS.map(({ key, labelKey }) => (
              <React.Fragment key={key}>
                <button
                  type="button"
                  ref={(el) => setTabRef(key, el)}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex w-fit items-center justify-center px-5 py-2.5 text-center",
                    activeTab === key
                      ? "title-3 text-font-1"
                      : "body-2 text-font-disabled",
                  )}
                >
                  {t(labelKey)}
                </button>
                {key === "character" && (
                  <button
                    type="button"
                    disabled
                    className="body-2 flex w-fit cursor-default items-center justify-center px-5 py-2.5 text-center text-font-disabled"
                  >
                    -
                  </button>
                )}
              </React.Fragment>
            ))}

            <motion.span
              className="absolute bottom-0 h-0.5 bg-brand"
              initial={false}
              animate={{ x: underlineRect.left, width: underlineRect.width }}
              transition={SPRING_SNAPPY}
            />
          </nav>

          <header className="flex w-full items-center justify-between">
            <div className="title-5 flex items-center gap-1 text-font-2">
              <span>{t("profile.worksList")}</span>
              <span>{displayArray.length}</span>
            </div>

            <div id="sort-filter-container" className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={toggle}
                className="title-5 flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-font-2 transition-colors duration-200 hover:bg-btn-hover hover:text-font-1"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
              >
                <Sort className="size-4" />
                {t(`profile.sort.${sort}`)}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <CharacterSortPopover
                    onChange={setSort}
                    onClose={toggle}
                    triggerRef={
                      triggerRef as React.RefObject<HTMLButtonElement>
                    }
                    value={sort}
                  />
                )}
              </AnimatePresence>
            </div>
          </header>
        </div>

        <section
          id="character-list-section"
          className="flex h-auto w-full flex-col justify-center gap-4"
        >
          <CharacterShowcase
            charArray={displayArray}
            cardSize="S"
            rowGap={28}
            columnGap={16}
          />
        </section>
      </section>
    </article>
  );
}
