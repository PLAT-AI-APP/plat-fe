"use client";

import React from "react";
import { ModalLayout } from "../ModalLayout";
import { cn } from "@/lib/utils";
import Check from "@/icons/Check";
import { useTranslations } from "next-intl";

interface CategorySelectPopoverProps {
  onClose: () => void;
  categoryTriggerRef: React.RefObject<HTMLElement | null> | undefined;
  currentCategory: string;
  handlecategory: (category: string) => void;
}
const CategorySelectPopover = ({
  categoryTriggerRef,
  currentCategory,
  handlecategory,
  onClose,
}: CategorySelectPopoverProps) => {
  const t = useTranslations("category");
  const categoryLabelByValue: Record<(typeof CATEGORIES)[number], string> = {
    시뮬레이션: t("simulation"),
    로맨스: t("romance"),
    "판타지/SF": t("fantasySf"),
    드라마: t("drama"),
    "무협/사극": t("martialArtsHistorical"),
    GL: t("gl"),
    BL: t("bl"),
    "공포/추리": t("horrorMystery"),
    액션: t("action"),
    "코믹/일상": t("comicDaily"),
    "스포츠/학원": t("sportsSchool"),
    기타: t("etc"),
  };

  return (
    <ModalLayout
      onClose={onClose}
      triggerRef={categoryTriggerRef} // ModalLayout에 전달
      className="w-full right-0 bottom-full top-auto -translate-y-2.5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-1 "
      >
        {CATEGORIES.map((category) => {
          const isActive = currentCategory === category;
          return (
            <div
              key={category}
              onClick={() => handlecategory(category)}
              className={cn(
                "body-4 flex cursor-pointer justify-between rounded-lg px-2.5 py-2 text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1",
                isActive && "text-font-1",
              )}
            >
              <span>{categoryLabelByValue[category]}</span>
              {isActive && <Check className="w-4.5 h-4.5 text-brand" />}
            </div>
          );
        })}
      </div>
    </ModalLayout>
  );
};

export default CategorySelectPopover;

const CATEGORIES = [
  "시뮬레이션",
  "로맨스",
  "판타지/SF",
  "드라마",
  "무협/사극",
  "GL",
  "BL",
  "공포/추리",
  "액션",
  "코믹/일상",
  "스포츠/학원",
  "기타",
];
