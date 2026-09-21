"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Close, Search } from "@/icons";
import ChattingList from "./ChattingList";

const MyChattingContents = () => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <section className="mx-auto flex w-full max-w-[860px] flex-col gap-8 pt-6">
      {/* 검색창 폭이 354px 로 고정이라 좁은 화면에서 제목 자리를 다 먹어 "내 채팅" 이
          "내 채 / 팅" 으로 쪼개졌다. 한 줄에 다 안 들어가면 검색창을 아래로 내린다. */}
      <header className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <h1 className="heading-2 shrink-0 text-font-1">
          {t("myChatting.title")}
        </h1>

        <label
          htmlFor="my-chatting-search"
          className="group flex h-10 w-full items-center gap-2 rounded-xl border border-main bg-dark px-4 py-2 transition-colors focus-within:field-focus! sm:w-[354px]"
        >
          <Search className="size-[18px] shrink-0 text-font-disabled transition-colors group-focus-within:text-font-1" />
          <input
            id="my-chatting-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder={isSearchFocused ? "" : t("myChatting.searchPlaceholder")}
            className="focus-ring-none body-5 min-w-0 flex-1 appearance-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setSearchQuery("")}
            aria-label={t("myChatting.clearSearch")}
            className={cn(
              "flex size-4 shrink-0 items-center justify-center text-font-2 transition hover:text-font-1",
              searchQuery ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Close className="size-3" aria-hidden="true" />
          </button>
        </label>
      </header>

      <div className="flex w-full flex-col gap-2">
        <ChattingList searchQuery={searchQuery} />
      </div>
    </section>
  );
};

export default MyChattingContents;
