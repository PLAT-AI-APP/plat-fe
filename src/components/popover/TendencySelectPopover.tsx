"use client";

import React from "react";
import { ModalLayout } from "../ModalLayout";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const TENDENCY_LIST = ["전체", "남성향", "여성향"] as const;

interface tendencySelectPopoverProps {
  onClose: () => void;
  tendencyTriggerRef: React.RefObject<HTMLElement | null> | undefined;
  currentTendency: string;
  handleTendency: (tendency: string) => void;
}
const TendencySelectPopover = ({
  onClose,
  tendencyTriggerRef,
  currentTendency,
  handleTendency,
}: tendencySelectPopoverProps) => {
  const t = useTranslations("selector");
  const tendencyLabelByValue: Record<(typeof TENDENCY_LIST)[number], string> = {
    전체: t("all"),
    남성향: t("male"),
    여성향: t("female"),
  };

  return (
    <ModalLayout
      onClose={onClose}
      triggerRef={tendencyTriggerRef} // ModalLayout에 전달
      className="w-full"
    >
      <div
        role="listbox"
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-1"
      >
        {TENDENCY_LIST.map((tendency) => {
          const isActive = currentTendency === tendency;
          return (
            <button
              key={tendency}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => handleTendency(tendency)}
              className={cn(
                "body-4 flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1",
                isActive && "text-font-1",
              )}
            >
              <span>{tendencyLabelByValue[tendency]}</span>
              {isActive && <Check className="w-4.5 h-4.5 text-brand" />}
            </button>
          );
        })}
      </div>
    </ModalLayout>
  );
};

export default TendencySelectPopover;
