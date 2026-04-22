import React from "react";
import { ModalLayout } from "../ModalLayout";

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
    <ModalLayout
      onClose={onClose}
      triggerRef={triggerRef}
      className="border border-border-main"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className="px-2.5 py-2 rounded-lg hover:bg-btn-hover"
      >
        수정하기
      </div>
      <div
        // onClick={() => deletePersona(persona.personaId)}
        onClick={() => handleAction(onDelete)}
        className="px-2.5 py-2 rounded-lg hover:bg-btn-hover"
      >
        삭제하기
      </div>
    </ModalLayout>
  );
};

export default PersonaMenuPopover;
