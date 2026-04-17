"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
// import Character from "./_components/character/indext";
// import Community from "./_components/community";
import Header from "./_components/Header";
import CharacterGrid from "@/components/character/CharacterGrid";
import { ModalLayout } from "@/components/ModalLayout";
import { Sort } from "@/icons";
import Check from "@/icons/Check";

const CharArray = [
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
  {
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
  },
];

const SORT_OPTIONS = ["최신순", "채팅순"] as const;

// const TABS = [
//   { id: "profile", title: "캐릭터", component: Character },
//   { id: "details", title: "커뮤니티", component: Community },
// ] as const;

const ProfilePage = () => {
  // 상태 및 참조 변수
  const [sort, setSort] = useState<string>("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 로직 및 추출 변수
  // const [currentTabId, setCurrentTabId] =
  //   useState<(typeof TABS)[number]["id"]>("profile");
  // const activeTab = TABS.find((tab) => tab.id === currentTabId);
  // const ActiveComponent = activeTab?.component;

  // 정렬 선택 처리 함수
  const handleSort = (text: string) => {
    setSort(text);
    setIsSortOpen(false);
  };

  return (
    <main className="flex flex-col gap-11.5 px-10 pt-7.5">
      {/* 사용자 프로필 정보 요약 영역 */}
      <Header />

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
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              <Sort className="w-3.5 h-3.5" />
              {sort}
            </button>

            {isSortOpen && (
              <ModalLayout
                onClose={() => setIsSortOpen(false)}
                triggerRef={triggerRef}
              >
                <nav>
                  <ul
                    className="flex flex-col gap-1 text-nowrap"
                    role="listbox"
                  >
                    {SORT_OPTIONS.map((option) => {
                      const isSelected = sort === option;
                      return (
                        <li
                          key={option}
                          role="option"
                          aria-selected={isSelected}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSort(option);
                          }}
                          className={cn(
                            "w-33.5 text-sm flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                            isSelected ? "font-medium" : "hover:bg-btn-hover",
                          )}
                        >
                          {option}
                          {isSelected && (
                            <Check className="w-4 h-4 text-brand" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </ModalLayout>
            )}
          </div>
        </header>

        <section
          id="character-list-section"
          className="w-full h-auto flex flex-col gap-4 justify-center"
        >
          <CharacterGrid
            char={CharArray}
            lineCount={2}
            cardHeight={277}
            rowGap={8}
            columnGap={10}
          />
        </section>

        {/* <nav className="flex gap-1 mb-1.5">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setCurrentTabId(tab.id)}
              className={cn(
                "text-sm text-font-2 p-2.5 cursor-pointer translate-y-0.5",
                currentTabId === tab.id &&
                  "text-font-1 font-semibold border-b-2 border-brand",
              )}
            >
              {tab.title}
            </button>
          ))}
        </nav>
        <article>{ActiveComponent ? <ActiveComponent /> : null}</article> */}
      </section>
    </main>
  );
};

export default ProfilePage;
