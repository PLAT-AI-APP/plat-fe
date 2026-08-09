"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { Edit, Trash } from "@/icons";
import { PopoverLayout } from "./layout";

interface PastConversationPopoverProps {
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PastConversationPopover = ({
  onClose,
  onDelete,
  onEdit,
  triggerRef,
}: PastConversationPopoverProps) => {
  const t = useTranslations("popover");

  const handleAction = (action: () => void) => {
    // 메뉴 선택 후 팝오버 레이어를 먼저 정리
    onClose();
    action();
  };

  // 지나온 대화 메뉴 항목 목록
  const pastConversationActions = [
    {
      icon: <Edit className="size-3.5 text-font-1" />,
      label: t("edit"),
      onClick: () => handleAction(onEdit),
      textClassName: "text-font-1",
    },
    {
      icon: <Trash className="size-3.5 text-font-accents" />,
      label: t("delete"),
      onClick: () => handleAction(onDelete),
      textClassName: "text-font-accents",
    },
  ];

  return (
    <PopoverLayout
      onClose={onClose}
      triggerRef={triggerRef}
      className="right-0 top-[calc(100%+8px)] w-[102px] min-w-0 rounded-xl border-main bg-dark px-2 py-3 shadow-[0_10px_40px_0_rgba(0,0,0,0.5)]"
    >
      <menu className="flex flex-col gap-1">
        {pastConversationActions.map(({ icon, label, onClick, textClassName }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="body-4 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-btn-hover"
          >
            {icon}
            <span className={textClassName}>{label}</span>
          </button>
        ))}
      </menu>
    </PopoverLayout>
  );
};

export default PastConversationPopover;
