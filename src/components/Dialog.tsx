import React from "react";
import { ModalLayout } from "./ModalLayout";
import { cn } from "@/lib/utils";

interface DialogProps {
  onClose: () => void;
  label: string | React.ReactNode;
  description?: string;
  cancelText?: string;
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
  cancelText = "취소",
}: DialogProps) => {
  const hasCancelButton = Boolean(cancelFn);

  const handleCancel = () => {
    if (cancelFn) {
      cancelFn();
      return;
    }

    onClose();
  };

  const handleConfirm = () => {
    confirmFn?.();
  };

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="w-[385px] max-w-[calc(100vw-40px)] overflow-hidden rounded-3xl border border-border-main bg-bg-dark px-6 pb-6 pt-8"
    >
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full flex-col items-start gap-3">
          {/* label이 문자열이면 p태그로 래핑, 아니면 그대로 렌더링 */}
          {typeof label === "string" ? (
            <h2 className="title-2 w-full text-font-1">{label}</h2>
          ) : (
            label
          )}
          {description && (
            <p className="body-4 w-full whitespace-pre-line text-font-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex w-full items-end gap-2 title-5">
          {hasCancelButton && (
            <button
              onClick={handleCancel}
              type="button"
              className="flex h-10.5 flex-1 items-center justify-center rounded-xl bg-card px-6 text-font-1 transition-colors hover:bg-card-hover"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              "flex h-10.5 items-center justify-center rounded-xl bg-brand px-6 text-font-4 transition-opacity hover:opacity-90",
              hasCancelButton ? "flex-1" : "w-full",
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default Dialog;
