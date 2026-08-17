"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "@/components/popover/layout";
import { ArrowDown, Check } from "@/icons";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";

const PERIOD_IDS = ["live", "daily", "monthly", "weekly"] as const;

const PeriodPills = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "live";

  return (
    <ul className="flex items-center gap-2">
      {PERIOD_IDS.map((id) => {
        const isActive = currentPeriod === id;

        return (
          <li key={id}>
            <Link
              href={{ query: { tab: "categories", period: id } }}
              className={cn(
                "flex items-center justify-center whitespace-nowrap rounded-[20px] px-4 py-2 text-base",
                isActive
                  ? "title-3 bg-font-1 text-font-4"
                  : "text-font-1 bg-card-selected",
              )}
            >
              {t(`ranking.${id}`)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

type MessageKey = Parameters<ReturnType<typeof useTranslations>>[0];

const CONTENT_TYPES = ["character", "world"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];
const CONTENT_TYPE_LABEL_KEYS: Record<ContentType, MessageKey> = {
  character: "categoriesPage.contentTypeCharacter",
  world: "categoriesPage.contentTypeWorld",
};

const SORT_OPTIONS = ["chats", "recommended", "wish"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];
const SORT_LABEL_KEYS: Record<SortOption, MessageKey> = {
  chats: "categoriesPage.sortChats",
  recommended: "categoriesPage.sortRecommended",
  wish: "categoriesPage.sortWish",
};

interface FilterDropdownProps<T extends string> {
  value: T;
  options: readonly T[];
  labelKeys: Record<T, MessageKey>;
  onChange: (value: T) => void;
}

const FilterDropdown = <T extends string>({
  value,
  options,
  labelKeys,
  onChange,
}: FilterDropdownProps<T>) => {
  const t = useTranslations();
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
        className="flex min-w-30 items-center justify-center gap-1 whitespace-nowrap rounded-xl py-2.5 pl-5 pr-4 hover:bg-btn-hover"
      >
        <span className="title-3 whitespace-nowrap text-font-2">
          {t(labelKeys[value] as MessageKey)}
        </span>
        <ArrowDown className="size-6 text-font-2" />
      </button>

      {isOpen && (
        <PopoverLayout
          onClose={() => setIsOpen(false)}
          triggerRef={triggerRef}
          className="left-0 right-auto min-w-30"
        >
          <ul className="flex flex-col gap-1" role="listbox">
            {options.map((option) => {
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
                    "body-4 flex cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 hover:bg-btn-hover",
                    isSelected && "title-5 text-brand",
                  )}
                >
                  {t(labelKeys[option] as MessageKey)}
                  {isSelected && <Check className="size-4 text-brand" />}
                </li>
              );
            })}
          </ul>
        </PopoverLayout>
      )}
    </div>
  );
};

const CategoryRankingHeader = () => {
  const t = useTranslations();
  const [contentType, setContentType] = useState<ContentType>("character");
  const [sortOption, setSortOption] = useState<SortOption>("chats");

  const updatedAt = t("categoriesPage.rankingUpdatedAt", {
    date: dayjs().format("YY.MM.DD"),
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="title-2 text-font-1">{t("categoriesPage.rankingTitle")}</h2>
        <span className="body-5 text-font-disabled">{updatedAt}</span>
      </div>

      <div className="flex w-full items-center justify-between">
        <PeriodPills />

        <div className="flex items-center gap-2">
          <FilterDropdown
            value={contentType}
            options={CONTENT_TYPES}
            labelKeys={CONTENT_TYPE_LABEL_KEYS}
            onChange={setContentType}
          />
          <FilterDropdown
            value={sortOption}
            options={SORT_OPTIONS}
            labelKeys={SORT_LABEL_KEYS}
            onChange={setSortOption}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryRankingHeader;
