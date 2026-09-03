"use client";

import { motion } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useClickAway } from "@/hooks/useClickAway";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/utils";
import { TRANSITION_FAST, popVariants } from "@/constants/motion";

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
const modalContentMotion = popVariants;

const modalTransition = TRANSITION_FAST;

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

  // 배경을 깐 모달만 화면 전체를 가린다. 그때는 Tab 이 뒤 콘텐츠로 새면 안 되고,
  // Esc 로 닫을 수 있어야 하며, 닫힌 뒤에는 열었던 자리로 포커스가 돌아가야 한다.
  useFocusTrap({
    containerRef: modalRef,
    enabled: isClient && hasBackground,
    onEscape: onClose,
  });

  const modalContent = (
    <>
      {hasBackground && (
        <motion.div
          {...modalOverlayMotion}
          transition={modalTransition}
          className="fixed inset-0 bg-scrim/50 z-100"
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
          "z-101 rounded-xl bg-dark",
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
