"use client";
import React, { useRef, useState } from "react";
import Header from "./Header";
import { ArrowRight, Sort } from "@/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CharacterList from "./CharacterList";
import { ModalLayout } from "@/components/ModalLayout";
import Check from "@/icons/Check";
import ViewToggle from "./ViewToggle";

export const MOCK_STUDIO_DATA = {
  characterCount: 1999999999,
  chatCount: 1999999999,
  isIdentityVerified: true, // 본인인증 완료
  isAdultVerified: false, // 미인증
};

const SORT_OPTIONS = ["최신순", "채팅순"] as const;

const StudioContents = () => {
  // 상태 및 참조 변수
  const [sort, setSort] = useState<string>("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 정렬 선택 처리 함수
  const handleSort = (text: string) => {
    setSort(text);
    setIsSortOpen(false);
  };
  return (
    <section className="@container mx-auto w-full max-w-175 pt-7.5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 p-5 rounded-3xl border border-border-main bg-bg-darker">
            <Header />

            <hr className="text-border-main" />

            <div className="flex gap-3">
              {/* 캐릭터 */}
              <div className="flex flex-1 flex-col gap-2 text-sm">
                <span className="text-font-2">캐릭터</span>
                <span className="font-light">
                  {MOCK_STUDIO_DATA.characterCount}
                </span>
              </div>

              {/* 채팅수 */}
              <div className="flex flex-1 flex-col gap-2 text-sm">
                <span className="text-font-2">채팅수</span>
                <span className="font-light">{MOCK_STUDIO_DATA.chatCount}</span>
              </div>

              {/* 본인인증 */}
              <div className="flex flex-1 flex-col gap-2 text-sm">
                <span className="text-font-2">본인인증</span>
                <span className="font-light">
                  {MOCK_STUDIO_DATA.isIdentityVerified ? "인증완료" : "미인증"}
                </span>
              </div>

              {/* 성인인증 */}
              <div className="flex flex-1 items-center gap-2 relative">
                <div className="flex flex-1 flex-col gap-2 text-sm">
                  <span className="text-font-2">성인인증</span>
                  <span
                    className={`font-light ${!MOCK_STUDIO_DATA.isAdultVerified ? "text-font-disabled" : ""}`}
                  >
                    {MOCK_STUDIO_DATA.isAdultVerified ? "인증완료" : "미인증"}
                  </span>
                </div>
                {/* 화살표 아이콘 (오른쪽 끝) */}
                <Link href={""} className="p-1 rounded-lg hover:bg-btn-hover">
                  <ArrowRight className="w-3 h-3 text-font-2" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex justify-between rounded-3xl border border-border-main bg-bg-darker py-4 px-5",
              "@max-[400px]:flex-col @max-[400px]:gap-6",
            )}
          >
            <div className="flex flex-col gap-1 font-medium">
              <span>캐릭터 제작</span>
              <span className="text-xs text-font-2">
                나만의 캐릭터를 직접 만들고 공유해 보세요
              </span>
            </div>
            <Link
              href={`/character-creat`}
              className={cn(
                "flex items-center h-10 text-sm text-brand font-medium py-2.5 pr-5 pl-4 rounded-xl bg-brand-opacity border border-brand",
                "justify-center",
              )}
            >
              제작하기
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <header className="flex items-center justify-between py-1.5 px-2.5">
            <span className="text-font-2 text-sm">작품목록 2</span>

            <div className="flex gap-1 items-center">
              <ViewToggle />
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
                                isSelected
                                  ? "font-medium"
                                  : "hover:bg-btn-hover",
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
            </div>
          </header>
          <CharacterList />
        </div>
      </div>
    </section>
  );
};

export default StudioContents;
