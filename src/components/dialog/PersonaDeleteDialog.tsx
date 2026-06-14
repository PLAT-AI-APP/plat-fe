import type { PersonaDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const PersonaDeleteDialog = ({
  personaName,
  onClose,
  onConfirm,
}: PersonaDeleteDialogProps) => {
  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="취소하기"
      confirmText="확인하기"
      label="페르소나를 삭제할까요?"
      description={`'${personaName}'이 없어지면 다시 되돌릴 수 없어요.`}
      confirmFn={onConfirm}
    />
  );
};

export default PersonaDeleteDialog;
