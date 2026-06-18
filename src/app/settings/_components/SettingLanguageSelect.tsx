"use client";

import { useRef, useState } from "react";
import { ArrowDown, Check } from "@/icons";
import { LANGUAGE_LIST } from "@/constants/language";
import { useClickAway } from "@/hooks/useClickAway";
import { cn } from "@/lib/utils";
import { useLocaleStore } from "@/store/useLocaleStore";

const SettingLanguageSelect = () => {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 드롭다운 바깥 클릭 시 열린 상태를 정리해 다른 설정 행과 겹치지 않게 합니다.
  useClickAway(dropdownRef, () => setIsOpen(false), triggerRef);

  const selectedLanguage =
    LANGUAGE_LIST.find((language) => language.locale === locale) ??
    LANGUAGE_LIST[0];

  const handleSelect = (nextLocale: (typeof LANGUAGE_LIST)[number]["locale"]) => {
    setLocale(nextLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="title-3 flex h-10 min-w-[140px] max-w-[220px] items-center justify-between gap-3 rounded-xl bg-bg-darkest px-4 py-2 text-font-1"
      >
        <span className="truncate">{selectedLanguage.name}</span>
        <ArrowDown
          className={cn(
            "size-4 shrink-0 text-font-1 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-12 z-20 flex min-w-full max-w-[260px] flex-col gap-1 rounded-xl bg-bg-darkest p-3 shadow-card-heavy"
        >
          {LANGUAGE_LIST.map((language) => {
            const isSelected = language.locale === locale;

            return (
              <button
                key={language.locale}
                type="button"
                onClick={() => handleSelect(language.locale)}
                className={cn(
                  "body-2 flex h-8 w-full items-center justify-between rounded-lg px-3 py-1 text-font-1 transition-colors hover:bg-bg-dark",
                  isSelected && "bg-bg-dark",
                )}
              >
                {/* 언어 선택지는 현재 locale과 무관하게 각 언어의 고유 표기를 유지합니다. */}
                <span className="pr-3 whitespace-nowrap">{language.name}</span>
                {isSelected && <Check className="size-4 text-font-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SettingLanguageSelect;
