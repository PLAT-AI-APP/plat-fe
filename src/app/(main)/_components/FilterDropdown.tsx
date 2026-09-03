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
  // 방향키로 옮겨 다니는 커서. role="option" 을 선언해 놓고 <li> 가 포커스를 못 받으면
  // 보조기술에는 목록이라 알리면서 실제로는 마우스로만 고를 수 있는 상태가 된다.
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(options.indexOf(value), 0),
  );
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const openList = () => {
    setActiveIndex(Math.max(options.indexOf(value), 0));
    setIsOpen(true);
  };

  const moveActive = (delta: number) => {
    setActiveIndex((prev) => {
      const next = (prev + delta + options.length) % options.length;
      optionRefs.current[next]?.focus();
      return next;
    });
  };

  const select = (option: T) => {
    onChange(option);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      optionRefs.current[0]?.focus();
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      const last = options.length - 1;
      setActiveIndex(last);
      optionRefs.current[last]?.focus();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(options[activeIndex]);
    }
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : openList())}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" || isOpen) return;
          event.preventDefault();
          openList();
        }}
        className="flex items-center gap-1 whitespace-nowrap rounded-xl border border-main p-2.5 hover:bg-btn-hover"
      >
        <span className="title-3 whitespace-nowrap text-font-2">
          {t(labelKeys[value] as MessageKey)}
        </span>
        <ArrowDown className="size-6 text-font-2" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <PopoverLayout
            onClose={() => setIsOpen(false)}
            triggerRef={triggerRef}
            className="left-0 right-auto min-w-30"
          >
            <ul
              className="flex flex-col gap-1"
              role="listbox"
              onKeyDown={handleListKeyDown}
            >
              {options.map((option, index) => {
                const isSelected = option === value;

                return (
                  <li
                    key={option}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    role="option"
                    aria-selected={isSelected}
                    // roving tabIndex: 커서가 있는 항목만 Tab 순서에 들어간다.
                    tabIndex={index === activeIndex ? 0 : -1}
                    onClick={() => select(option)}
                    onFocus={() => setActiveIndex(index)}
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
