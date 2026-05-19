import React from "react";
import { PenSparkle, Trash } from "@/icons";
import { PopoverLayout } from "./layout";

interface MyChattingMenuPopoverProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onEdit: () => void;
  onDelete: () => void;
}

const MyChattingMenuPopover = ({
  onClose,
  triggerRef,
  onDelete,
  onEdit,
}: MyChattingMenuPopoverProps) => {
  // 로직 / 함수
  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <PopoverLayout onClose={onClose} triggerRef={triggerRef}>
      <nav
        id="chat-menu-nav"
        className="antialiased flex flex-col gap-1 whitespace-nowrap font-medium body-4"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={() => handleAction(onEdit)}
              className="items-center w-full hover:bg-btn-hover rounded-lg px-2.5 py-2 flex gap-2"
            >
              <PenSparkle className="w-4 h-4" /> 새 채팅
            </button>
          </li>

          <li>
            <button
              onClick={() => handleAction(onDelete)}
              className="items-center w-full rounded-lg px-2.5 py-2 flex gap-2 text-font-accents hover:bg-btn-hover"
            >
              <Trash className="w-4 h-4" /> 삭제
            </button>
          </li>
        </ul>
      </nav>
    </PopoverLayout>
  );
};

export default MyChattingMenuPopover;
