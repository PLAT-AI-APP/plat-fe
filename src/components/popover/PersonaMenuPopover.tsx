import React from "react";
import { Edit, Trash } from "@/icons";
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
  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };
  return (
    <PopoverLayout onClose={onClose} triggerRef={triggerRef}>
      <menu className="flex flex-col gap-1">
        <button
          onClick={() => handleAction(onEdit)}
          type="button"
          className="flex items-center gap-2 text-left text-sm px-2.5 py-2 rounded-lg hover:bg-btn-hover"
        >
          <Edit className="w-4 h-4" /> 수정
        </button>
        <button
          onClick={() => handleAction(onDelete)}
          type="button"
          className="font-medium flex items-center gap-2 text-font-accents text-sm text-left px-2.5 py-2 rounded-lg hover:bg-btn-hover"
        >
          <Trash className="w-4 h-4 text-font-accents" />
          삭제
        </button>
      </menu>
    </PopoverLayout>
  );
};

export default PersonaMenuPopover;
