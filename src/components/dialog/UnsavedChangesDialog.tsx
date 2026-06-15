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
      label="dialog.unsavedChanges.title"
      description="dialog.unsavedChanges.description"
      confirmText="dialog.unsavedChanges.confirm"
      confirmFn={onLeave}
    />
  );
};

export default UnsavedChangesDialog;
