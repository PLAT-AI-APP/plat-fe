"use client";

import { m } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TRANSITION_FAST, popVariants } from "@/constants/motion";
import { useClickAway } from "@/hooks/dom/useClickAway";
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
  /**
   * true면 트리거의 실제 위치/너비를 측정해 document.body에 포털로 그립니다.
   * 기본(false)은 트리거 기준 absolute 배치입니다 — 트리거가 스크롤 가능한
   * 조상(모달 등) 안에 있으면, absolute로 그린 팝오버가 화면 밖으로 튀어나와도
   * 그 조상의 overflow-y-auto 스크롤 영역에 포함되어 불필요한 스크롤이
   * 생깁니다. 너비도 트리거와 다르게(min-w 등) 어긋날 수 있습니다. 이 값을
   * true로 주면 fixed 포지셔닝 + 포털로 조상 스크롤에서 완전히 빠지고,
   * 너비도 트리거와 정확히 같아집니다.
   */
  matchTriggerWidth?: boolean;
}

export const PopoverLayout = ({
  children,
  onClose,
  triggerRef,
  className,
  matchTriggerWidth = false,
}: PopoverLayoutProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [triggerRect, setTriggerRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // 팝오버와 트리거 바깥을 누를 때만 닫아 내부 버튼 클릭은 안전하게 유지합니다.
  useClickAway(popoverRef, onClose, triggerRef);

  // 페인트 전에 위치를 구해야 트리거 자리에서 한 프레임 어긋나 보이지 않습니다.
  useLayoutEffect(() => {
    if (!matchTriggerWidth || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerRect({ top: rect.bottom + 10, left: rect.left, width: rect.width });
  }, [matchTriggerWidth, triggerRef]);

  const content = (
    <m.div
      ref={popoverRef}
      role="menu"
      /*
       * 모달(ModalLayout)은 등장/퇴장 애니메이션이 있는데 팝오버만 없어서,
       * 같은 앱 안에서 오버레이가 뜨는 방식이 둘로 갈려 있었다. 모달과 같은
       * variants·속도를 쓴다. 퇴장까지 재생하려면 호출부에서
       * AnimatePresence 로 감싸야 한다.
       */
      {...popVariants}
      transition={TRANSITION_FAST}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        onClose();
      }}
      style={
        matchTriggerWidth && triggerRect
          ? {
              position: "fixed",
              top: triggerRect.top,
              left: triggerRect.left,
              width: triggerRect.width,
            }
          : undefined
      }
      className={cn(
        // 그림자만으로 경계를 만든다. 테두리를 함께 쓰면 가장자리 신호가 두 겹으로 겹친다.
        "origin-top rounded-xl bg-dark px-2 py-3 shadow-popover",
        matchTriggerWidth
          ? // body에 포털로 그려지면 모달(z-index 100대)과 같은 층에서 경쟁하므로,
            // 그보다 확실히 높은 값을 준다. z-50은 모달 안에 있을 때만 충분했다.
            "z-[1000]"
          : "absolute right-0 top-[calc(100%+10px)] z-50 min-w-37.5 max-w-[calc(100vw-40px)]",
        className,
      )}
    >
      {children}
    </m.div>
  );

  if (matchTriggerWidth) {
    // 위치를 재기 전(첫 렌더)에는 그리지 않아, 잘못된 자리에서 한 프레임 깜빡이지 않게 합니다.
    if (!triggerRect) return null;
    return createPortal(content, document.body);
  }

  return content;
};
