"use client";

import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CharacterSortPopover, {
  CharacterSortOption,
} from "@/components/popover/CharacterSortPopover";
import { Sort } from "@/icons";

interface SortFilterProps {
  currentSort: CharacterSortOption;
  onChange: (nextSort: CharacterSortOption) => void;
}

const SortFilter = ({ currentSort, onChange }: SortFilterProps) => {
  const t = useTranslations();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSortChange = (newSort: CharacterSortOption) => {
    onChange(newSort);
    setIsSortOpen(false);
  };

  return (
    <div id="sort-filter-container" className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="title-5 flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 text-font-2 transition-colors duration-200 hover:bg-btn-hover hover:text-font-1"
        aria-haspopup="listbox"
        aria-expanded={isSortOpen}
      >
        <Sort className="h-4 w-4 text-font-2" />
        {t(`profile.sort.${currentSort}`)}
      </button>

      <AnimatePresence>
        {isSortOpen && (
          <CharacterSortPopover
            onChange={handleSortChange}
            onClose={() => setIsSortOpen(false)}
            triggerRef={triggerRef as React.RefObject<HTMLButtonElement>}
            value={currentSort}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortFilter;
