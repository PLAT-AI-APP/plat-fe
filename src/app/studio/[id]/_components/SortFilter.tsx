"use client";

import React, { useRef, useState } from "react";
import { Sort } from "@/icons";
import CharacterSortPopover from "@/components/popover/CharacterSortPopover";
import { useChangeQueryString } from "@/hooks/useChangeQueryString";

interface SortFilterProps {
  currentSort: "최신순" | "채팅순";
}

const SortFilter = ({ currentSort }: SortFilterProps) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const changeQueryString = useChangeQueryString();

  const handleSortChange = (newSort: string) => {
    changeQueryString({ updateKey: "sort", updateValue: newSort });
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
        {currentSort}
      </button>

      {isSortOpen && (
        <CharacterSortPopover
          onChange={handleSortChange}
          onClose={() => setIsSortOpen(false)}
          triggerRef={triggerRef as React.RefObject<HTMLButtonElement>}
          value={currentSort}
        />
      )}
    </div>
  );
};

export default SortFilter;
