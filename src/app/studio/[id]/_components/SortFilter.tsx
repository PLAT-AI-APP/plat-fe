"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ModalLayout } from "@/components/ModalLayout";
import { Sort } from "@/icons";
import Check from "@/icons/Check";

const SORT_OPTIONS = ["최신순", "채팅순"] as const;

const SortFilter = () => {
  const [sort, setSort] = useState<string>("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSort = (text: string) => {
    setSort(text);
    setIsSortOpen(false);
  };

  return (
    <div id="sort-filter-container" className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex items-center py-1 px-1.5 gap-1.5 text-sm text-font-2 font-medium cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isSortOpen}
      >
        <Sort className="w-4 h-4 text-font-2" />
        {sort}
      </button>

      {isSortOpen && (
        <ModalLayout
          onClose={() => setIsSortOpen(false)}
          triggerRef={triggerRef}
        >
          <nav>
            <ul className="flex flex-col gap-1 text-nowrap" role="listbox">
              {SORT_OPTIONS.map((option) => {
                const isSelected = sort === option;
                return (
                  <li
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort(option);
                    }}
                    className={cn(
                      "w-33.5 text-sm flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                      isSelected ? "font-medium" : "hover:bg-btn-hover",
                    )}
                  >
                    {option}
                    {isSelected && <Check className="w-4 h-4 text-brand" />}
                  </li>
                );
              })}
            </ul>
          </nav>
        </ModalLayout>
      )}
    </div>
  );
};

export default SortFilter;
