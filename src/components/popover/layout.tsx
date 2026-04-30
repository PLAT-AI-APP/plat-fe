"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useClickAway } from "@/hooks/useClickAway";

interface PopoverLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
  /**
   * 부모(Relative) 요소가 triggerRef이거나
   * triggerRef를 감싸는 상위 요소여야 합니다.
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

  // 외부 클릭 시 닫기 (triggerRef 영역 제외)
  useClickAway(popoverRef, onClose, triggerRef);

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      style={{ top: "calc(100% + 10px)" }} // 기준 요소 하단 10px
      className={cn(
        // right-0을 통해 기준 요소의 우측 끝에 맞춤
        "absolute px-2 py-3 right-0 z-50 w-37.5 bg-bg-dark rounded-xl shadow-card-heavy border border-border-main",
        className,
      )}
    >
      {children}
    </div>
  );
};
