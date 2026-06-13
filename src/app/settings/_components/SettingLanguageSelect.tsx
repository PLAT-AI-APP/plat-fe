"use client";

import { useRef, useState } from "react";
import { ArrowDown, Check } from "@/icons";
import { useClickAway } from "@/hooks/useClickAway";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS = ["한국어", "일본어", "중국어", "영어", "언어"] as const;

const SettingLanguageSelect = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useState<(typeof LANGUAGE_OPTIONS)[number]>("한국어");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 드롭다운 바깥 클릭 시 열린 상태를 정리해 다른 설정 행과 겹치지 않게 합니다.
  useClickAway(dropdownRef, () => setIsOpen(false), triggerRef);

  const handleSelect = (language: (typeof LANGUAGE_OPTIONS)[number]) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="title-3 flex h-10 w-[114px] items-center justify-between rounded-xl bg-bg-darkest px-4 py-2 text-font-1"
      >
        {selectedLanguage}
        <ArrowDown
          className={cn(
            "size-4 text-font-1 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-12 z-20 flex w-[114px] flex-col gap-1 rounded-xl bg-bg-darkest p-3 shadow-card-heavy"
        >
          {LANGUAGE_OPTIONS.map((language) => {
            const isSelected = language === selectedLanguage;

            return (
              <button
                key={language}
                type="button"
                onClick={() => handleSelect(language)}
                className={cn(
                  "body-2 flex h-8 w-full items-center justify-between rounded-lg px-3 py-1 text-font-1 transition-colors hover:bg-bg-dark",
                  isSelected && "bg-bg-dark",
                )}
              >
                <span>{language}</span>
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
