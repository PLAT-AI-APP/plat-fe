"use client";

import React from "react";
import { ModalLayout } from "../ModalLayout";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PublicSelectPopoverProps {
  onClose: () => void;
  publicTriggerRef: React.RefObject<HTMLElement | null> | undefined;
  isPublic: boolean;
  handleIsPublic: (isPublic: boolean) => void;
}
const PublicSelectPopover = ({
  handleIsPublic,
  isPublic,
  onClose,
  publicTriggerRef,
}: PublicSelectPopoverProps) => {
  const t = useTranslations("selector");

  return (
    <ModalLayout
      onClose={onClose}
      triggerRef={publicTriggerRef} // ModalLayout에 전달
      className="w-full"
    >
      <div
        role="listbox"
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-1"
      >
        {([true, false] as const).map((value) => {
          const isActive = isPublic === value;

          return (
            <button
              key={String(value)}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => handleIsPublic(value)}
              className={cn(
                "body-4 flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1",
                isActive && "text-font-1",
              )}
            >
              <span>{t(value ? "public" : "private")}</span>
              {isActive && <Check className="h-4.5 w-4.5 text-brand" />}
            </button>
          );
        })}
      </div>
    </ModalLayout>
  );
};

export default PublicSelectPopover;
