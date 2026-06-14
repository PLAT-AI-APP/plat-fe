import type { DraftOverwriteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const DraftOverwriteDialog = ({
  onCancel,
  onClose,
  onConfirm,
}: DraftOverwriteDialogProps) => {
  const handleCancel = () => {
    onClose();
    onCancel();
  };

  return (
    <Dialog
      onClose={handleCancel}
      cancelFn={handleCancel}
      label={
        <p className="text-center text-lg font-medium text-white">
          임시저장된 데이터를 <span className="text-brand">불러</span>
          올까요?
        </p>
      }
      description="저장하지 않은 데이터는 모두 사라집니다."
      confirmFn={onConfirm}
    />
  );
};

export default DraftOverwriteDialog;
