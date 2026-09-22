"use client";

import React from "react";
import { Flag } from "@/icons";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "./layout";
import PopoverMenuList from "./PopoverMenuList";

interface UniverseMenuPopoverProps {
  onReport?: () => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/** 세계관 상세에서 제작자가 아닌 사람에게 보이는 더보기 메뉴 */
const UniverseMenuPopover = ({
  onReport,
  onClose,
  triggerRef,
}: UniverseMenuPopoverProps) => {
  const t = useTranslations("popover");

  return (
    <PopoverLayout onClose={onClose} triggerRef={triggerRef}>
      <PopoverMenuList
        onClose={onClose}
        menuClassName="min-w-32"
        itemClassName="whitespace-nowrap rounded-lg p-1.5"
        items={[
          {
            key: "report",
            icon: <Flag className="w-5 h-5 text-font-2" />,
            label: t("report"),
            onClick: onReport,
          },
        ]}
      />
    </PopoverLayout>
  );
};

export default UniverseMenuPopover;
