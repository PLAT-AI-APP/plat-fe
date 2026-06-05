import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const SORT_OPTIONS = ["인기순", "대화량순", "관련도순", "최신순"] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

const SearchResultSort = () => {
  const [selectedSort, setSelectedSort] = useState<SortOption>("인기순");

  return (
    <nav aria-label="캐릭터 정렬">
      <ul className="flex items-center gap-1">
        {SORT_OPTIONS.map((option, index) => {
          const isSelected = selectedSort === option;

          return (
            <React.Fragment key={option}>
              {index > 0 && (
                <li aria-hidden="true">
                  <span className="block h-3 w-px rounded-[100px] bg-border-main" />
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
                  <span className="whitespace-nowrap">{option}</span>
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
