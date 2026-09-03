"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { TRANSITION_FAST, popVariants } from "@/constants/motion";
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
    <motion.div
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
      className={cn(
        // 그림자만으로 경계를 만든다. 테두리를 함께 쓰면 가장자리 신호가 두 겹으로 겹친다.
        "absolute right-0 top-[calc(100%+10px)] z-50 min-w-37.5 max-w-[calc(100vw-40px)] origin-top rounded-xl bg-dark px-2 py-3 shadow-popover",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};
