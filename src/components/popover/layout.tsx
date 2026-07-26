"use client";

import { useRef } from "react";
import { useClickAway } from "@/hooks/useClickAway";
import { cn } from "@/lib/utils";

interface PopoverLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
  /**
   * 팝오버 기준이 되는 트리거입니다.
   * useClickAway에서 트리거 클릭은 바깥 클릭으로 처리하지 않도록 함께 전달합니다.
   */
  triggerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const PopoverLayout = ({
  children,
  onClose,
  triggerRef,
  className,
}: PopoverLayoutProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // 팝오버와 트리거 바깥을 누를 때만 닫아 내부 버튼 클릭은 안전하게 유지합니다.
  useClickAway(popoverRef, onClose, triggerRef);

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-0 top-[calc(100%+10px)] z-50 min-w-37.5 max-w-[calc(100vw-40px)] rounded-xl border border-border-main bg-bg-dark px-2 py-3 shadow-popover",
        className,
      )}
    >
      {children}
    </div>
  );
};
