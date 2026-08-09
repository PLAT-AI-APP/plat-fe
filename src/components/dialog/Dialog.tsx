"use client";

import { ModalLayout } from "@/components/ModalLayout";
import { useTranslateText } from "@/hooks/useTranslateText";
import { cn } from "@/lib/utils";
import type { DialogProps } from "@/type/dialog";

const Dialog = ({
  onClose,
  label,
  description,
  cancelFn,
  confirmFn,
  confirmText = "common.confirm",
  cancelText = "common.cancel",
}: DialogProps) => {
  const translateText = useTranslateText();
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
      className="w-[385px] max-w-[calc(100vw-40px)] overflow-hidden rounded-3xl border border-main bg-dark px-6 pb-6 pt-8"
    >
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full flex-col items-start gap-3">
          {/* JSX 제목은 호출부가 그대로 제어하고, 문자열 제목만 공통 번역/타이포를 적용합니다. */}
          {typeof label === "string" ? (
            <h2 className="title-2 w-full text-font-1">
              {translateText(label)}
            </h2>
          ) : (
            label
          )}

          {typeof description === "string" ? (
            <p className="body-4 w-full whitespace-pre-line text-font-2">
              {translateText(description)}
            </p>
          ) : (
            description
          )}
        </div>

        <div className="title-5 flex w-full items-end gap-2">
          {hasCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-10.5 flex-1 items-center justify-center rounded-xl bg-card px-6 text-font-1 transition-colors hover:bg-card-hover"
            >
              {translateText(cancelText)}
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
            {translateText(confirmText)}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default Dialog;
