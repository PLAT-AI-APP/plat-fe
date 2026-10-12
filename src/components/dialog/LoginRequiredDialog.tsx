import type { LoginRequiredDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";
import DialogHero from "./DialogHero";

const LoginRequiredDialog = ({
  confirmText = "dialog.loginRequired.confirm",
  description,
  label,
  onClose,
  onConfirm,
}: LoginRequiredDialogProps) => {
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <Dialog
      onClose={onClose}
      hero={<DialogHero variant="wave" />}
      label={label}
      description={description}
      confirmText={confirmText}
      confirmFn={handleConfirm}
    />
  );
};

export default LoginRequiredDialog;
