import type { WithdrawalConfirmDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WithdrawalConfirmDialog = ({
  isPending,
  onClose,
  onConfirm,
}: WithdrawalConfirmDialogProps) => {
  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="남아있기"
      confirmText={isPending ? "탈퇴 처리 중" : "탈퇴하기"}
      label="정말 떠나시나요?"
      description={`탈퇴가 완료되면 그동안의 소중한 정보들을 다시 볼 수 없게
돼요. 정말 탈퇴를 진행할까요?`}
      confirmFn={onConfirm}
    />
  );
};

export default WithdrawalConfirmDialog;
