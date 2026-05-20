import React from "react";
import { ModalLayout } from "../ModalLayout";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";

const TENDENCY_LIST = ["전체", "남성향", "여성향"] as const;

interface tendencySelectPopoverProps {
  onClose: () => void;
  tendencyTriggerRef: React.RefObject<HTMLElement | null> | undefined;
  currentTendency: string;
  handleTendency: (tendency: string) => void;
}
const TendencySelectPopover = ({
  onClose,
  tendencyTriggerRef,
  currentTendency,
  handleTendency,
}: tendencySelectPopoverProps) => {
  return (
    <ModalLayout
      onClose={onClose}
      triggerRef={tendencyTriggerRef} // ModalLayout에 전달
      className="w-full"
    >
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
        {TENDENCY_LIST.map((tendency) => {
          const isActive = currentTendency === tendency;
          return (
            <div
              key={tendency}
              onClick={() => handleTendency(tendency)}
              className={cn(
                "hover:bg-btn-hover body-4 flex justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                isActive && "title-5",
              )}
            >
              <span>{tendency}</span>
              {isActive && <Check className="w-4.5 h-4.5 text-brand" />}
            </div>
          );
        })}
      </div>
    </ModalLayout>
  );
};

export default TendencySelectPopover;
