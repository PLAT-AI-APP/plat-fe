"use client";

import React from "react";
import { Edit, Trash } from "@/icons";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "./layout";

interface CharacterMenuPopoverProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const CharacterMenuPopover = ({
  onClose,
  triggerRef,
  onDelete,
  onEdit,
}: CharacterMenuPopoverProps) => {
  const t = useTranslations("popover");

  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <PopoverLayout triggerRef={triggerRef} onClose={onClose}>
      <menu className="flex flex-col gap-1">
        <button
          onClick={() => handleAction(onEdit)}
          type="button"
          className="flex items-center gap-2 text-left body-5 px-2.5 py-2 rounded-lg hover:bg-btn-hover transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>{t("edit")}</span>
        </button>
        <button
          onClick={() => handleAction(onDelete)}
          type="button"
          className="flex items-center gap-2 text-danger body-5 text-left px-2.5 py-2 rounded-lg hover:bg-btn-hover transition-colors"
        >
          <Trash className="w-4 h-4 text-danger" />
          <span>{t("delete")}</span>
        </button>
      </menu>
    </PopoverLayout>
  );
};

export default CharacterMenuPopover;
