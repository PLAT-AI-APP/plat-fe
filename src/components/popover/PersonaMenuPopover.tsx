"use client";

import React from "react";
import { Pen, Trash } from "@/icons";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "./layout";

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

  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };
  return (
    <PopoverLayout
      onClose={onClose}
      triggerRef={triggerRef}
      className="border-none left-1/2 right-auto top-[calc(100%+12px)] w-max min-w-28 -translate-x-1/2 rounded-xl bg-btn-selected px-1 py-2"
    >
      <menu className="flex flex-col gap-1">
        <button
          onClick={() => handleAction(onEdit)}
          type="button"
          className="flex items-center gap-2 text-left body-5 p-2 rounded-lg hover:bg-btn-hover"
        >
          <Pen className="size-5 text-font-2" /> {t("editPersona")}
        </button>
        <button
          onClick={() => handleAction(onDelete)}
          type="button"
          className="flex items-center gap-2 body-5 text-left p-2 rounded-lg hover:bg-btn-hover"
        >
          <Trash className="size-5 text-font-2" />
          {t("deletePersona")}
        </button>
      </menu>
    </PopoverLayout>
  );
};

export default PersonaMenuPopover;
