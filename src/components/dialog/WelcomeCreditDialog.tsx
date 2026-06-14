import type { WelcomeCreditDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const WelcomeCreditDialog = ({
  onClose,
  onConfirm,
}: WelcomeCreditDialogProps) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog
      onClose={handleConfirm}
      label="웰컴 크레딧 선물이 도착했어요"
      description={
        <div className="body-4 w-full text-font-2">
          <p>
            특별한 인연을 위해,{" "}
            <span className="title-5 text-font-1">
              웰컴노트 크레딧을 선물했어요.
            </span>
          </p>
          <p>저희와 함께 즐거운 순간을 만들어 볼까요?</p>
        </div>
      }
      confirmText="확인"
      confirmFn={handleConfirm}
    />
  );
};

export default WelcomeCreditDialog;
