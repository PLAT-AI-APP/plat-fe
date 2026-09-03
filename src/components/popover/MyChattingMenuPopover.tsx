"use client";

import React from "react";
import { PenSparkle, Pin, Trash } from "@/icons";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PopoverLayout } from "./layout";

interface MyChattingMenuPopoverProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onEdit: () => void;
  onPin: () => void;
  onDelete: () => void;
}

const MyChattingMenuPopover = ({
  onClose,
  triggerRef,
  onDelete,
  onEdit,
  onPin,
}: MyChattingMenuPopoverProps) => {
  const t = useTranslations("popover");

  const handleAction = (action?: () => void) => {
    // 액션 실행 뒤 팝오버 닫기
    action?.();
    onClose();
  };

  // 내 채팅 아이템 팝오버 액션 목록
  const menuActions = [
    {
      icon: <PenSparkle className="size-4 shrink-0" />,
      label: t("newChat"),
      onClick: onEdit,
      textClassName: "text-font-1",
    },
    {
      icon: <Pin className="size-4 shrink-0" />,
      label: t("pinChat"),
      onClick: onPin,
      textClassName: "text-font-1",
    },
    {
      icon: <Trash className="size-4 shrink-0" />,
      label: t("delete"),
      onClick: onDelete,
      textClassName: "text-font-accents",
    },
  ];

  return (
    <PopoverLayout
      onClose={onClose}
      triggerRef={triggerRef}
      className="right-0 top-[calc(100%+10px)] w-[150px] overflow-hidden rounded-xl border-main bg-dark px-2 py-3 shadow-card-heavy"
    >
      <nav
        id="chat-menu-nav"
        className="body-4 flex flex-col gap-1 whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex w-full flex-col gap-1">
          {menuActions.map(({ icon, label, onClick, textClassName }) => (
            <li key={label} className="w-full">
              <button
                type="button"
                onClick={() => handleAction(onClick)}
                className={cn(
                  "menu-item w-full gap-2 text-left",
                  textClassName,
                )}
              >
                {icon}
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </PopoverLayout>
  );
};

export default MyChattingMenuPopover;
