import type { WithdrawalCompleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WithdrawalCompleteDialog = ({
  onClose,
  onConfirm,
}: WithdrawalCompleteDialogProps) => {
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <Dialog
      onClose={handleConfirm}
      label="그동안 이용해 주셔서 감사해요"
      description={`그동안 PLAT과 함께해 주셔서 감사해요.\n언제든 다시 만날 수 있길 바랄게요.`}
      confirmText="확인"
      confirmFn={handleConfirm}
    />
  );
};

export default WithdrawalCompleteDialog;
