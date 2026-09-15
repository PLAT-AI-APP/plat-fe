"use client";

import React from "react";
import { Edit, Trash } from "@/icons";
import { useTranslations } from "next-intl";
import { PopoverLayout } from "./layout";
import PopoverMenuList from "./PopoverMenuList";

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

  return (
    <PopoverLayout triggerRef={triggerRef} onClose={onClose}>
      <PopoverMenuList
        onClose={onClose}
        itemClassName="rounded-lg px-2.5 py-2"
        items={[
          {
            key: "edit",
            icon: <Edit className="w-4 h-4" />,
            label: t("edit"),
            onClick: onEdit,
          },
          {
            key: "delete",
            icon: <Trash className="w-4 h-4 text-danger" />,
            label: t("delete"),
            onClick: onDelete,
            danger: true,
          },
        ]}
      />
    </PopoverLayout>
  );
};

export default CharacterMenuPopover;
