"use client";

import React, { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import MyChattingSortPopover, {
  MY_CHATTING_SORT_LABELS,
  type MyChattingSortOption,
} from "@/components/popover/MyChattingSortPopover";
import useToggle from "@/hooks/useToggle";
import type { AppLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { ArrowDown, Close, Search } from "@/icons";
import ChattingList from "./ChattingList";

const SEARCH_PLACEHOLDER: Record<AppLocale, string> = {
  ko: "채팅 내용, 캐릭터, 페르소나 이름으로 찾아보세요",
  en: "Search by chat, character, or persona name",
  ja: "チャット内容、キャラクター、ペルソナ名で検索",
  zh: "按聊天内容、角色或人设名称搜索",
  th: "ค้นหาด้วยเนื้อหาแชต ตัวละคร หรือชื่อเพอร์โซนา",
  vi: "Tìm theo nội dung chat, nhân vật hoặc tên persona",
};

const CLEAR_SEARCH_LABEL: Record<AppLocale, string> = {
  ko: "검색어 지우기",
  en: "Clear search",
  ja: "検索語を消去",
  zh: "清除搜索词",
  th: "ล้างคำค้นหา",
  vi: "Xoa tu khoa tim kiem",
};

const MyChattingContents = () => {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const { close, isOpen, toggle } = useToggle();
  const [sortOption, setSortOption] =
    useState<MyChattingSortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <section className="mx-auto flex w-full max-w-[860px] flex-col gap-8 pt-7.5">
      <header className="flex items-end justify-between">
        <h1 className="heading-2 text-font-1">{t("myChatting.title")}</h1>

        <label
          htmlFor="my-chatting-search"
          className="group flex h-10 w-[354px] items-center gap-2 rounded-xl border border-main bg-dark px-4 py-2 transition-colors focus-within:bg-darker"
        >
          <Search className="size-[18px] shrink-0 text-font-disabled transition-colors group-focus-within:text-font-1" />
          <input
            id="my-chatting-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder={isSearchFocused ? "" : SEARCH_PLACEHOLDER[locale]}
            className="body-4 min-w-0 flex-1 appearance-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setSearchQuery("")}
            aria-label={CLEAR_SEARCH_LABEL[locale]}
            className={cn(
              "flex size-4 shrink-0 items-center justify-center text-font-2 transition-opacity",
              searchQuery ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Close className="size-3" aria-hidden="true" />
          </button>
        </label>
      </header>

      <div className="flex w-full flex-col gap-2">
        <div className="relative">
          <button
            ref={sortTriggerRef}
            type="button"
            onClick={toggle}
            className="title-5 flex items-center gap-1 rounded-lg px-4 py-1.5 text-font-2 transition-colors duration-200 hover:bg-btn-hover hover:text-font-1"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            {MY_CHATTING_SORT_LABELS[locale][sortOption]}
            <ArrowDown className="size-4" aria-hidden="true" />
          </button>

          {isOpen && (
            <MyChattingSortPopover
              value={sortOption}
              onChange={setSortOption}
              onClose={close}
              triggerRef={sortTriggerRef}
            />
          )}
        </div>

        <ChattingList sortOption={sortOption} searchQuery={searchQuery} />
      </div>
    </section>
  );
};

export default MyChattingContents;
