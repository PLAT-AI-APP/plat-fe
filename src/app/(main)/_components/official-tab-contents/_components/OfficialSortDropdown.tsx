"use client";

import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "@/components/popover/layout";
import { ArrowDown, Check } from "@/icons";
import { cn } from "@/lib/utils";

/**
 * 서버가 줄 세울 수 있는 기준만 둡니다 — universes 가 세고 있는 대화 수와 찜 수 둘입니다.
 * "추천"은 이 섹션에 대응하는 근거가 서버에 없어 뺐습니다.
 */
export const OFFICIAL_SORT_OPTIONS = ["chats", "wish"] as const;
export type OfficialSortOption = (typeof OFFICIAL_SORT_OPTIONS)[number];

const SORT_LABEL_KEYS: Record<OfficialSortOption, "sortByChats" | "sortWish"> = {
  chats: "sortByChats",
  wish: "sortWish",
};

interface OfficialSortDropdownProps {
  value: OfficialSortOption;
  onChange: (sort: OfficialSortOption) => void;
}

const OfficialSortDropdown = ({ value, onChange }: OfficialSortDropdownProps) => {
  const t = useTranslations("officialPage");
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
        className="flex items-center gap-1 whitespace-nowrap rounded-xl border border-main p-2.5 hover:bg-btn-hover"
      >
        <span className="body-5 whitespace-nowrap text-font-2">
          {t(SORT_LABEL_KEYS[value])}
        </span>
        <ArrowDown className="size-4 text-font-2" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <PopoverLayout
            onClose={() => setIsOpen(false)}
            triggerRef={triggerRef}
            className="min-w-30"
          >
            <ul className="flex flex-col gap-1" role="listbox">
              {OFFICIAL_SORT_OPTIONS.map((option) => {
                const isSelected = option === value;

                return (
                  <li
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "menu-item body-5 cursor-pointer justify-between gap-2 whitespace-nowrap",
                      isSelected && "title-5 text-brand",
                    )}
                  >
                    {t(SORT_LABEL_KEYS[option])}
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
