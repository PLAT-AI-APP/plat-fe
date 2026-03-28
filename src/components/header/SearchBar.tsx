import { Close, Search } from "@/icons";
import { ModalLayout } from "../ModalLayout";
import { useRef, useState } from "react";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import { cn } from "@/lib/utils";

export const SearchBar = () => {
  const triggerRef = useRef<HTMLFormElement>(null); // 버튼을 위한 ref
  const [isActive, setIsActive] = useState<boolean>(false);

  const { removeKeyword, keywords, clearAll } = useRecentSearch();

  const popularKeyword = [
    "오늘일만보걸었다",
    "로맨스",
    "차도동",
    "일진",
    "중대장",
    "아포칼립스",
    "리버스 이세계",
    "판타지",
    "사라기",
    "아카데미",
  ];
  return (
    <form
      id="search-bar-form"
      role="search"
      ref={triggerRef}
      className="relative flex items-center group w-full"
      onSubmit={(e) => e.preventDefault()} // 엔터 시 페이지 새로고침 방지
    >
      <input
        id="search-input"
        type="text"
        className="text-sm border cursor-pointer border-border-main w-full h-10 px-4 pl-10 rounded-xl focus:outline-none transition-all placeholder:text-font-disabled focus:cursor-text focus:border-font-1"
        placeholder="검색어를 입력하세요"
        // 포커스 시 활성화
        onFocus={() => setIsActive(true)}
      />

      {/* 아이콘 영역을 label로 감싸 클릭 시 input에 포커스가 가도록 개선 */}
      <label
        id="search-icon-wrapper"
        htmlFor="search-input"
        className="absolute left-4 cursor-pointer pointer-events-none"
      >
        <Search
          id="icon-search-glass"
          className="text-font-disabled w-4.5 h-4.5 "
        />
      </label>

      {isActive && (
        <ModalLayout
          triggerRef={triggerRef || null}
          onClose={() => setIsActive(false)}
          className="w-85 p-5 flex flex-col gap-6.5"
        >
          {/* 최근 검색어 영역 */}
          {keywords.length > 0 && (
            <section className="flex flex-col gap-4">
              <header className="flex justify-between">
                <h1 className="text-font-1">최근 검색어</h1>
                <button
                  onClick={clearAll}
                  className="cursor-pointer text-font-2 hover:underline text-[12px]"
                >
                  전체삭제
                </button>
              </header>

              <ul id="recent-keyword-list" className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className={cn(
                      "flex gap-2 items-center text-sm rounded-[100px] border border-border-main justify-between py-1.5 pl-3 pr-2 transition-colors cursor-pointer",
                      "[&:not(:has(.close-btn:hover))]:hover:bg-btn-hover",
                    )}
                  >
                    {keyword}
                    <button
                      id={`remove-keyword-${keyword}`}
                      onClick={() => removeKeyword(keyword)}
                      className="close-btn w-4 h-4 rounded-full flex items-center justify-center hover:bg-btn-hover transition-colors"
                    >
                      <Close className="w-3 h-3 text-font-2" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 인기 검색어 영역 */}
          <section className="flex flex-col gap-4">
            <h1 id="popular-search-title" className="text-font-1">
              인기 검색어
            </h1>

            <ol className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-1">
              {popularKeyword.map((item, index) => {
                const isTopThree = index < 3;

                return (
                  <li key={index} className="flex items-center gap-2 px-1 py-2">
                    {/* 순위 숫자 */}
                    <span
                      className={cn(
                        "w-3.75",
                        isTopThree ? "text-brand font-semibold" : "text-font-2",
                      )}
                    >
                      {index + 1}
                    </span>
                    {/* 검색어 키워드 */}
                    <span
                      className={cn(
                        "text-sm cursor-pointer hover:underline",
                        isTopThree ? "text-font-1 font-medium" : "text-font-2",
                      )}
                    >
                      {item}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        </ModalLayout>
      )}
    </form>
  );
};
