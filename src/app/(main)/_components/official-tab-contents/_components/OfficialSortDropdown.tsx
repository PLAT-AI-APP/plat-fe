"use client";

import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "@/components/popover/layout";
import { ArrowDown, Check } from "@/icons";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = ["chats"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const OfficialSortDropdown = () => {
  const t = useTranslations("officialPage");
  const [sortOption, setSortOption] = useState<SortOption>("chats");
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center gap-1 whitespace-nowrap rounded-xl py-2.5 pl-5 pr-4 hover:bg-btn-hover"
      >
        <span className="title-3 whitespace-nowrap text-font-2">
          {t("sortByChats")}
        </span>
        <ArrowDown className="size-6 text-font-2" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <PopoverLayout
            onClose={() => setIsOpen(false)}
            triggerRef={triggerRef}
            className="left-0 right-auto min-w-30"
          >
            <ul className="flex flex-col gap-1" role="listbox">
              {SORT_OPTIONS.map((option) => {
                const isSelected = option === sortOption;

                return (
                  <li
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSortOption(option);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "body-4 flex cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 hover:bg-btn-hover",
                      isSelected && "title-5 text-brand",
                    )}
                  >
                    {t("sortByChats")}
                    {isSelected && <Check className="size-4 text-brand" />}
                  </li>
                );
              })}
            </ul>
          </PopoverLayout>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfficialSortDropdown;
