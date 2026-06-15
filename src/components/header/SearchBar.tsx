"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Close, Search } from "@/icons";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import { cn } from "@/lib/utils";
import { ModalLayout } from "../ModalLayout";

export const SearchBar = () => {
  const t = useTranslations();
  const triggerRef = useRef<HTMLFormElement>(null);
  const [isActive, setIsActive] = useState(false);
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
      className="group relative flex min-w-[260px] items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        id="search-input"
        type="text"
        className="body-4 h-10 w-full cursor-pointer rounded-xl border border-border-main px-4 pl-10 transition-all placeholder:body-4 placeholder:text-font-disabled focus:cursor-text focus:border-font-1 focus:outline-none"
        placeholder={t("searchBar.placeholder")}
        onFocus={() => setIsActive(true)}
      />

      <label
        id="search-icon-wrapper"
        htmlFor="search-input"
        className="pointer-events-none absolute left-4 cursor-pointer"
      >
        <Search
          id="icon-search-glass"
          className="h-4.5 w-4.5 text-font-disabled"
        />
      </label>

      {isActive && (
        <ModalLayout
          triggerRef={triggerRef || null}
          onClose={() => setIsActive(false)}
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
                    className={cn(
                      "body-4 flex cursor-pointer items-center justify-between gap-2 rounded-[100px] border border-border-main py-1.5 pr-2 pl-3 transition-colors",
                      "[&:not(:has(.close-btn:hover))]:hover:bg-btn-hover",
                    )}
                  >
                    {keyword}
                    <button
                      id={`remove-keyword-${keyword}`}
                      onClick={() => removeKeyword(keyword)}
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
