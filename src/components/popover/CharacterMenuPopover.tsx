import React from "react";
import { Edit, Trash } from "@/icons";
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
  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <PopoverLayout triggerRef={triggerRef} onClose={onClose}>
      <menu className="flex flex-col gap-1 font-medium">
        <button
          onClick={() => handleAction(onEdit)}
          type="button"
          className="flex items-center gap-2 text-left body-4 px-2.5 py-2 rounded-lg hover:bg-btn-hover transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>수정</span>
        </button>
        <button
          onClick={() => handleAction(onDelete)}
          type="button"
          className="flex items-center gap-2 text-font-accents body-4 text-left px-2.5 py-2 rounded-lg hover:bg-btn-hover transition-colors"
        >
          <Trash className="w-4 h-4 text-font-accents" />
          <span>삭제</span>
        </button>
      </menu>
    </PopoverLayout>
  );
};

export default CharacterMenuPopover;
