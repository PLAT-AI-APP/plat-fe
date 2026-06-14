import type { UnsavedChangesDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const UnsavedChangesDialog = ({
  onCancel,
  onClose,
  onLeave,
}: UnsavedChangesDialogProps) => {
  const handleCancel = () => {
    onClose();
    onCancel();
  };

  return (
    <Dialog
      onClose={handleCancel}
      cancelFn={handleCancel}
      label="저장되지 않은 변경사항이 있습니다."
      description="지금 나가시면 수정된 내용은 저장되지 않습니다."
      confirmText="나가기"
      confirmFn={onLeave}
    />
  );
};

export default UnsavedChangesDialog;
