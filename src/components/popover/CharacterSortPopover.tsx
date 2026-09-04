"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { PopoverLayout } from "./layout";

export const CHARACTER_SORT_OPTIONS = ["latest", "chats"] as const;

export type CharacterSortOption = (typeof CHARACTER_SORT_OPTIONS)[number];

interface CharacterSortPopoverProps {
  value: CharacterSortOption;
  onChange: (newSort: CharacterSortOption) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const CharacterSortPopover = ({
  value,
  onChange,
  onClose,
  triggerRef,
}: CharacterSortPopoverProps) => {
  const t = useTranslations();

  const handleSort = (option: CharacterSortOption) => {
    onChange(option);
    onClose();
  };

  return (
    <PopoverLayout onClose={onClose} triggerRef={triggerRef}>
      <nav>
        <ul className="flex flex-col gap-1 text-nowrap" role="listbox">
          {CHARACTER_SORT_OPTIONS.map((option) => {
            const isSelected = value === option;

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
                  "menu-item body-4 w-33.5 cursor-pointer justify-between",
                  isSelected && "title-5 text-brand",
                )}
              >
                {t(`profile.sort.${option}`)}
                {isSelected && <Check className="size-4 text-brand" />}
              </li>
            );
          })}
        </ul>
      </nav>
    </PopoverLayout>
  );
};

export default CharacterSortPopover;
