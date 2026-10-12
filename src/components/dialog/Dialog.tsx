"use client";

import { ModalLayout } from "@/components/ModalLayout";
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
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
  isConfirmPending = false,
  hero,
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
    // 창이 그대로인 채 버튼도 그대로면 한 번 더 누르게 되고, 같은 요청이 두 번 나갔다.
    if (isConfirmPending) return;
    confirmFn?.();
  };

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="w-[385px] max-w-[calc(100vw-40px)] overflow-hidden rounded-3xl bg-dark px-6 pb-6 pt-8"
    >
      {/* 연출 띠는 창 가장자리까지 꽉 채운다 */}
      {hero && <div className="-mx-6 -mt-8 mb-6">{hero}</div>}
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full flex-col items-start gap-3">
          {/* JSX 제목은 호출부가 그대로 제어하고, 문자열 제목만 공통 번역/타이포를 적용합니다. */}
          <div
            className={cn("w-full", hero && "scene-rise")}
            style={hero ? { animationDelay: "0.2s" } : undefined}
          >
            {typeof label === "string" ? (
              <h2 className="title-2 w-full text-font-1">
                {translateText(label)}
              </h2>
            ) : (
              label
            )}
          </div>

          {description && (
            <div
              className={cn("w-full", hero && "scene-rise")}
              style={hero ? { animationDelay: "0.28s" } : undefined}
            >
              {typeof description === "string" ? (
                <p className="body-5 w-full whitespace-pre-line text-font-2">
                  {translateText(description)}
                </p>
              ) : (
                description
              )}
            </div>
          )}
        </div>

        <div className="title-5 flex w-full items-end gap-2">
          {hasCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-10 flex-1 items-center justify-center rounded-xl bg-card px-6 text-font-1 transition-colors hover:bg-card-hover"
            >
              {translateText(cancelText)}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmPending}
            aria-busy={isConfirmPending || undefined}
            className={cn(
              "flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand px-6 text-on-brand transition-opacity hover:opacity-90",
              hasCancelButton ? "flex-1" : "w-full",
              isConfirmPending && "pending-state",
            )}
          >
            {isConfirmPending && (
              <span
                aria-hidden="true"
                className="size-4 shrink-0 animate-spin rounded-full border-2 border-on-brand/40 border-t-on-brand"
              />
            )}
            {translateText(confirmText)}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default Dialog;
