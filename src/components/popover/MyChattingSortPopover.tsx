"use client";

import type React from "react";
import { useLocale } from "next-intl";
import type { AppLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { PopoverLayout } from "./layout";

export const MY_CHATTING_SORT_OPTIONS = [
  "latest",
  "chatCount",
  "oldest",
] as const;

export type MyChattingSortOption = (typeof MY_CHATTING_SORT_OPTIONS)[number];

// 내 채팅 정렬 옵션의 언어별 표시 문구
export const MY_CHATTING_SORT_LABELS: Record<
  AppLocale,
  Record<MyChattingSortOption, string>
> = {
  ko: {
    latest: "최신순",
    chatCount: "대화량 순",
    oldest: "오래된 순",
  },
  en: {
    latest: "Latest",
    chatCount: "Most chatted",
    oldest: "Oldest",
  },
  ja: {
    latest: "最新順",
    chatCount: "会話数順",
    oldest: "古い順",
  },
  zh: {
    latest: "最新顺",
    chatCount: "对话量顺",
    oldest: "最早顺",
  },
  th: {
    latest: "ล่าสุด",
    chatCount: "จำนวนบทสนทนา",
    oldest: "เก่าสุด",
  },
  vi: {
    latest: "Mới nhất",
    chatCount: "Nhiều trò chuyện nhất",
    oldest: "Cũ nhất",
  },
};

interface MyChattingSortPopoverProps {
  onChange: (option: MyChattingSortOption) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  value: MyChattingSortOption;
}

const MyChattingSortPopover = ({
  onChange,
  onClose,
  triggerRef,
  value,
}: MyChattingSortPopoverProps) => {
  const locale = useLocale() as AppLocale;
  const labels = MY_CHATTING_SORT_LABELS[locale];

  const handleSelect = (option: MyChattingSortOption) => {
    // 선택 즉시 정렬을 반영하고 팝오버 닫기
    onChange(option);
    onClose();
  };

  return (
    <PopoverLayout
      onClose={onClose}
      triggerRef={triggerRef}
      className="left-0 top-[calc(100%+8px)] w-[114px] min-w-[114px] max-w-[114px] gap-2 rounded-xl border-main bg-dark px-2 py-3 shadow-card-heavy"
    >
      <nav aria-label="내 채팅 정렬">
        <ul className="flex flex-col gap-2" role="listbox">
          {MY_CHATTING_SORT_OPTIONS.map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "title-5 flex w-full items-center rounded-lg px-2 py-1 text-left text-font-2 transition-colors duration-200 hover:bg-card hover:text-font-1",
                  value === option && "bg-card",
                )}
              >
                {labels[option]}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </PopoverLayout>
  );
};

export default MyChattingSortPopover;
