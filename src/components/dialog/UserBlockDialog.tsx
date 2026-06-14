import type { UserBlockDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const UserBlockDialog = ({
  nickname,
  onClose,
  onConfirm,
}: UserBlockDialogProps) => {
  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="취소하기"
      confirmText="차단하기"
      label={`‘${nickname}’을 차단할까요?`}
      description="차단한 유저가 만든 캐릭터를 보거나 채팅에 참여할 수 없어요."
      confirmFn={onConfirm}
    />
  );
};

export default UserBlockDialog;
