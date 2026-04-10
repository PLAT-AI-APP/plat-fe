import React from "react";
import { ModalLayout } from "./ModalLayout";
import ActiveButton from "./ActiveButton";

interface DialogProps {
  onClose: () => void;
  label: string | React.ReactNode;
  description?: string;
  cancelFn?: () => void;
  confirmFn?: () => void;
  confirmText?: string;
}
const Dialog = ({
  onClose,
  label,
  description,
  cancelFn,
  confirmFn,
  confirmText = "저장",
}: DialogProps) => {
  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="p-6 pt-8 rounded-3xl"
    >
      <div>
        <div className="flex flex-col gap-2">
          {/* label이 문자열이면 p태그로 래핑, 아니면 그대로 렌더링 */}
          {typeof label === "string" ? (
            <p className="text-white text-lg font-medium text-center">
              {label}
            </p>
          ) : (
            label
          )}
          <p className="text-sm text-font-2 text-center">{description}</p>
        </div>

        <div className="flex gap-3 pt-9 text-sm font-medium">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 px-6.5 py-3.25 rounded-xl bg-card hover:bg-card-hover"
          >
            취소
          </button>
          <ActiveButton
            isActive
            text={confirmText}
            onClick={confirmFn}
            className="flex-1 px-6.5 py-3.25 rounded-xl"
          />
        </div>
      </div>
    </ModalLayout>
  );
};

export default Dialog;
