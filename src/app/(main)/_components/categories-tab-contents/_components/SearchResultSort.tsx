"use client";

import type { CategorySort } from "@/api/search/getCategorySearch";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React from "react";

/**
 * 서버의 CategorySort 하나가 항목 하나다. 예전에 있던 "관련도순"은 고른 태그를 전부 가진 것만
 * 결과에 오르는 지금 규칙에서는 모든 줄의 일치 태그 수가 같아 순서를 만들지 못해 뺐다.
 */
const SORT_OPTIONS: { id: CategorySort; messageKey: string }[] = [
  { id: "POPULAR", messageKey: "popular" },
  { id: "CHAT", messageKey: "chats" },
  { id: "LATEST", messageKey: "latest" },
];

interface SearchResultSortProps {
  value: CategorySort;
  onChange: (sort: CategorySort) => void;
}

const SearchResultSort = ({ value, onChange }: SearchResultSortProps) => {
  const t = useTranslations("searchSort");

  return (
    <nav aria-label={t("navigation")} className="min-w-0">
      {/* 정렬 항목은 언어에 따라 길이가 크게 달라진다. 줄바꿈 대신 가로로 밀어 본다. */}
      <ul className="flex items-center gap-1 overflow-x-auto">
        {SORT_OPTIONS.map((option, index) => {
          const isSelected = value === option.id;

          return (
            <React.Fragment key={option.id}>
              {index > 0 && (
                <li aria-hidden="true">
                  <span className="block h-3 w-px rounded-full bg-main" />
                </li>
              )}
              <li>
                <button
                  type="button"
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => onChange(option.id)}
                  className={cn(
                    "flex h-[29px] items-center justify-center gap-1 px-2 py-1 transition-colors",
                    isSelected
                      ? "title-5 text-brand"
                      : "body-5 text-font-2 hover:text-font-1",
                  )}
                >
                  {isSelected && (
                    <Check className="size-3.5 shrink-0 text-brand" />
                  )}
                  <span className="whitespace-nowrap">
                    {t(option.messageKey)}
                  </span>
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
