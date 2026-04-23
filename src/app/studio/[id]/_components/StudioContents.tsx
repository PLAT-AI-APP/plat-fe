"use client";
import React, { useRef, useState } from "react";
import Header from "./Header";
import CharacterList from "./CharacterList";
import ViewToggle from "./ViewToggle";
import StudioStats from "./StudioStats";
import CharacterCreateBanner from "./CharacterCreateBanner";
import { Sort } from "@/icons";
import CharacterSortPopover from "@/components/popover/CharacterSortPopover";
import CharacterGrid from "@/components/character/CharacterGrid";

const CharArray = [
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
  {
    id: 398292,
    name: "옆자리 불량학생",
    chatCount: 123,
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
    img: "https://picsum.photos/200/300",
    isPublic: false,
  },
];

interface StudioContentsProps {
  id: string;
}
const StudioContents = ({ id }: StudioContentsProps) => {
  const [sort, setSort] = useState<"최신순" | "채팅순">("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <section className="@container mx-auto w-full max-w-175 pt-7.5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 p-5 rounded-3xl border border-border-main bg-bg-darker">
            <Header id={id} />
            <hr className="text-border-main" />
            <StudioStats />
          </div>

          <CharacterCreateBanner />
        </div>

        <div className="flex flex-col gap-2">
          <header className="flex items-center justify-between py-1.5 px-2.5">
            <span className="text-font-2 text-sm">
              작품목록 {CharArray.length}
            </span>

            <div className="flex gap-1 items-center">
              <ViewToggle setViewMode={setViewMode} viewMode={viewMode} />
              <div id="sort-filter-container" className="relative">
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center py-1 px-1.5 gap-1.5 text-sm text-font-2 font-medium cursor-pointer"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                >
                  <Sort className="w-4 h-4 text-font-2" />
                  {sort}
                </button>

                {isSortOpen && (
                  <CharacterSortPopover
                    onChange={setSort}
                    onClose={() => setIsSortOpen(false)}
                    triggerRef={
                      triggerRef as React.RefObject<HTMLButtonElement>
                    }
                    value={sort}
                  />
                )}
              </div>
            </div>
          </header>

          {CharArray.length <= 0 ? (
            <div className="flex items-center justify-center w-full h-50">
              <div className="flex flex-col gap-1 text-center">
                <span className="text-font-2">아직 캐릭터가 없어요</span>
                <span className="text-xs text-font-disabled">
                  나만의 매력적인 AI 캐릭터를 만들어보세요
                </span>
              </div>
            </div>
          ) : viewMode === "list" ? (
            <CharacterList char={CharArray} />
          ) : (
            <CharacterGrid
              rowGap={12}
              columnGap={12}
              char={CharArray}
              cardClassName="min-w-37.5 max-w-60"
              gridClassName="grid-cols-2 @[474px]:grid-cols-3 @[636px]:grid-cols-4"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default StudioContents;
