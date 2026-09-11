"use client";

import React from "react";
import { Pen, Trash } from "@/icons";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "./layout";
import PopoverMenuList from "./PopoverMenuList";

interface PersonaMenuPopoverProps {
  /** 각 액션 발생 시 실행될 콜백 함수들 */
  onEdit?: () => void;
  onDelete?: () => void;
  /** 팝업 닫기 및 위치 참조 */
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}
const PersonaMenuPopover = ({
  onClose,
  triggerRef,
  onDelete,
  onEdit,
}: PersonaMenuPopoverProps) => {
  const t = useTranslations("popover");

  return (
    <PopoverLayout
      onClose={onClose}
      triggerRef={triggerRef}
      className="border-none left-1/2 right-auto top-[calc(100%+12px)] w-max min-w-28 -translate-x-1/2 rounded-xl bg-btn-selected px-1 py-2"
    >
      <PopoverMenuList
        onClose={onClose}
        itemClassName="rounded-lg p-2"
        items={[
          {
            key: "edit",
            icon: <Pen className="size-5 text-font-2" />,
            label: t("editPersona"),
            onClick: onEdit,
          },
          {
            key: "delete",
            icon: <Trash className="size-5 text-font-2" />,
            label: t("deletePersona"),
            onClick: onDelete,
          },
        ]}
      />
    </PopoverLayout>
  );
};

export default PersonaMenuPopover;
