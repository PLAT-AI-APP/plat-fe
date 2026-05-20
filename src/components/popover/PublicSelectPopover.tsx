import React from "react";
import { ModalLayout } from "../ModalLayout";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";

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
  return (
    <ModalLayout
      onClose={onClose}
      triggerRef={publicTriggerRef} // ModalLayout에 전달
      className="w-full"
    >
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
        <div
          onClick={() => handleIsPublic(true)}
          className={cn(
            "hover:bg-btn-hover body-4 flex justify-between px-2.5 py-2 rounded-lg cursor-pointer",
            isPublic && "title-5",
          )}
        >
          <span>공개</span>
          {isPublic && <Check className="w-4.5 h-4.5 text-brand" />}
        </div>

        <div
          onClick={() => handleIsPublic(false)}
          className={cn(
            "hover:bg-btn-hover body-4 flex justify-between px-2.5 py-2 rounded-lg cursor-pointer",
            !isPublic && "title-5",
          )}
        >
          <span>비공개</span>
          {!isPublic && <Check className="w-4.5 h-4.5 text-brand" />}
        </div>
      </div>
    </ModalLayout>
  );
};

export default PublicSelectPopover;
