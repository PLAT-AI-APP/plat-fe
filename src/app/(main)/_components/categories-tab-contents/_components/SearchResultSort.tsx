"use client";

import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const SORT_OPTIONS = ["popular", "chats", "interest", "latest"] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

const SearchResultSort = () => {
  const t = useTranslations("searchSort");
  const [selectedSort, setSelectedSort] = useState<SortOption>("popular");

  return (
    <nav aria-label={t("navigation")}>
      <ul className="flex items-center gap-1">
        {SORT_OPTIONS.map((option, index) => {
          const isSelected = selectedSort === option;

          return (
            <React.Fragment key={option}>
              {index > 0 && (
                <li aria-hidden="true">
                  <span className="block h-3 w-px rounded-[100px] bg-main" />
                </li>
              )}
              <li>
                <button
                  type="button"
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => setSelectedSort(option)}
                  className={cn(
                    "flex h-[29px] items-center justify-center gap-1 px-2 py-1 transition-colors",
                    isSelected
                      ? "title-5 text-brand"
                      : "body-4 text-font-2 hover:text-font-1",
                  )}
                >
                  {isSelected && (
                    <Check className="size-3.5 shrink-0 text-brand" />
                  )}
                  <span className="whitespace-nowrap">{t(option)}</span>
                </button>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default SearchResultSort;
