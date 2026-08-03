"use client";

import React, { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import MyChattingSortPopover, {
  MY_CHATTING_SORT_LABELS,
  type MyChattingSortOption,
} from "@/components/popover/MyChattingSortPopover";
import useToggle from "@/hooks/useToggle";
import type { AppLocale } from "@/i18n/config";
import { ArrowDown } from "@/icons";
import ChattingList from "./ChattingList";

const MyChattingContents = () => {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const { close, isOpen, toggle } = useToggle();
  const [sortOption, setSortOption] =
    useState<MyChattingSortOption>("latest");

  return (
    <section className="mx-auto flex w-full max-w-[860px] flex-col gap-9 pt-7.5">
      <header className="flex items-end justify-between">
        <h1 className="heading-2 text-font-1">{t("myChatting.title")}</h1>

        <div className="relative">
          <button
            ref={sortTriggerRef}
            type="button"
            onClick={toggle}
            className="title-5 flex items-center gap-1 text-font-2 transition-colors duration-200 hover:text-font-1"
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
      </header>

      <ChattingList sortOption={sortOption} />
    </section>
  );
};

export default MyChattingContents;
