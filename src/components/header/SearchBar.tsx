"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Close, Search } from "@/icons";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import { cn } from "@/lib/utils";
import { ModalLayout } from "../ModalLayout";

export const SearchBar = () => {
  const t = useTranslations();
  const router = useRouter();
  const triggerRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { addKeyword, removeKeyword, keywords, clearAll } = useRecentSearch();

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

  const handleExpand = () => {
    setIsExpanded(true);
    setIsActive(true);
  };

  const handleCloseSearch = () => {
    setIsActive(false);
    setIsExpanded(false);
  };

  // 최근/인기 검색어 클릭과 폼 제출이 같은 검색 실행 흐름을 공유합니다.
  const handleSearch = (rawKeyword: string) => {
    const trimmedKeyword = rawKeyword.trim();
    if (!trimmedKeyword) return;

    addKeyword(trimmedKeyword);
    handleCloseSearch();
    router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(searchValue);
  };

  useEffect(() => {
    if (!isExpanded) return;

    inputRef.current?.focus();
  }, [isExpanded]);

  return (
    <form
      id="search-bar-form"
      role="search"
      ref={triggerRef}
      className={cn(
        "group relative flex h-10 items-center transition-all duration-200 ease-out",
        isExpanded ? "w-[340px] min-w-[260px]" : "w-10 min-w-10",
      )}
      onSubmit={handleSubmit}
    >
      {!isExpanded ? (
        <button
          id="search-icon-button"
          type="button"
          aria-label={t("searchBar.placeholder")}
          onClick={handleExpand}
          className="flex size-10 items-center justify-center rounded-xl text-font-2 transition-colors "
        >
          <Search id="icon-search-glass" className="size-6" />
        </button>
      ) : (
        <>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={searchValue}
            className="body-4 h-10 w-full cursor-pointer rounded-xl border border-main px-4 pl-10 transition-all placeholder:body-4 placeholder:text-font-disabled focus:cursor-text focus:border-font-1 focus:outline-none"
            placeholder={t("searchBar.placeholder")}
            onChange={(event) => setSearchValue(event.target.value)}
            onFocus={() => setIsActive(true)}
          />

          <label
            id="search-icon-wrapper"
            htmlFor="search-input"
            className="pointer-events-none absolute left-4 cursor-pointer"
          >
            <Search
              id="icon-search-glass"
              className="size-6 text-font-disabled"
            />
          </label>
        </>
      )}

      {isExpanded && isActive && (
        <ModalLayout
          triggerRef={triggerRef || null}
          onClose={handleCloseSearch}
          className="flex w-85 flex-col gap-6.5 p-5"
        >
          {keywords.length > 0 && (
            <section className="flex flex-col gap-4">
              <header className="flex justify-between">
                <h1 className="title-3 text-font-1">
                  {t("searchBar.recentTitle")}
                </h1>
                <button
                  onClick={clearAll}
                  className="body-6 cursor-pointer text-font-2 hover:underline"
                >
                  {t("searchBar.clearAll")}
                </button>
              </header>

              <ul id="recent-keyword-list" className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <li
                    key={keyword}
                    onClick={() => handleSearch(keyword)}
                    className={cn(
                      "body-4 flex cursor-pointer items-center justify-between gap-2 rounded-[100px] border border-main py-1.5 pr-2 pl-3 transition-colors",
                      "[&:not(:has(.close-btn:hover))]:hover:bg-btn-hover",
                    )}
                  >
                    {keyword}
                    <button
                      id={`remove-keyword-${keyword}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeKeyword(keyword);
                      }}
                      className="close-btn flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-btn-hover"
                    >
                      <Close className="h-3 w-3 text-font-2" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="flex flex-col gap-4">
            <h1 id="popular-search-title" className="title-3 text-font-1">
              {t("searchBar.popularTitle")}
            </h1>

            <ol className="grid grid-flow-col grid-cols-2 grid-rows-5 gap-1">
              {popularKeyword.map((item, index) => {
                const isTopThree = index < 3;

                return (
                  <li key={index} className="flex items-center gap-2 px-1 py-2">
                    <span
                      className={cn(
                        "body-4 w-3.75",
                        isTopThree ? "title-5 text-brand" : "text-font-2",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      onClick={() => handleSearch(item)}
                      className={cn(
                        "body-4 cursor-pointer hover:underline",
                        isTopThree ? "title-5 text-font-1" : "text-font-2",
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
