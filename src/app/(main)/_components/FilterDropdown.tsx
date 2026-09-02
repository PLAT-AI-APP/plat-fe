"use client";

import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "@/components/popover/layout";
import { ArrowDown, Check } from "@/icons";
import { cn } from "@/lib/utils";

type MessageKey = Parameters<ReturnType<typeof useTranslations>>[0];

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
        className="flex items-center gap-1 whitespace-nowrap rounded-xl border border-main p-2.5 hover:bg-btn-hover"
      >
        <span className="body-4 whitespace-nowrap text-font-2">
          {t(labelKeys[value] as MessageKey)}
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
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
