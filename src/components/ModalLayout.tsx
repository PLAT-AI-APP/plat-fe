"use client";

import { motion } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useClickAway } from "@/hooks/useClickAway";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  hasBackground?: boolean;
  stackIndex?: number;
}

/** 클라이언트 렌더링 여부 확인 */
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/** 모달 오버레이 페이드 애니메이션 */
const modalOverlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** 모달 본문 등장 애니메이션 */
const modalContentMotion = {
  initial: { opacity: 0, scale: 0.86, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.86, y: 8 },
};

/** 빠르고 부드러운 모달 전환 */
const modalTransition = {
  duration: 0.18,
  ease: "easeOut",
} as const;

export const ModalLayout = ({
  children,
  onClose,
  className,
  triggerRef,
  hasBackground = false,
  stackIndex = 0,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayZIndex = 100 + stackIndex * 2;
  const modalZIndex = overlayZIndex + 1;

  // SSR 환경에서는 portal 대상이 없으므로 클라이언트에서만 렌더링
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const handleClose = triggerRef && !hasBackground ? onClose : () => {};

  // 배경 모달과 팝오버의 기준 위치가 달라 위치 클래스를 분리
  const modalPositionClass = hasBackground
    ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    : "absolute right-0 top-full translate-y-2.5";

  useClickAway(modalRef, handleClose, triggerRef);

  const modalContent = (
    <>
      {hasBackground && (
        <motion.div
          {...modalOverlayMotion}
          transition={modalTransition}
          className="fixed inset-0 bg-font-4/50 z-100"
          style={{ zIndex: overlayZIndex }}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          onMouseDown={(event) => event.stopPropagation()}
          aria-hidden="true"
        />
      )}

      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        {...modalContentMotion}
        transition={modalTransition}
        style={{ zIndex: modalZIndex }}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          "z-101 rounded-xl border border-main bg-dark",
          hasBackground ? "shadow-card-heavy" : "shadow-popover",
          !hasBackground && "px-2 py-3",
          modalPositionClass,
          className,
        )}
      >
        {children}
      </motion.div>
    </>
  );

  if (!isClient) return null;

  if (hasBackground) return createPortal(modalContent, document.body);
  return modalContent;
};
