"use client";

import { useClickAway } from "@/hooks/useClickAway";
import { cn } from "@/lib/utils";
import { useRef, useSyncExternalStore } from "react"; // 변경
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  hasBackground?: boolean;
  stackIndex?: number;
}

// 클라이언트 사이드 여부를 확인하는 간단한 유틸리티
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

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

  // useEffect + useState 대신 사용하여 성능 경고를 피함
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const handleClose = triggerRef && !hasBackground ? onClose : () => {};

  // 배경 모달과 팝오버는 기준 위치가 달라 Tailwind 위치 클래스를 분리해 충돌을 막습니다.
  const modalPositionClass = hasBackground
    ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    : "absolute right-0 top-full translate-y-2.5";
  useClickAway(modalRef, handleClose, triggerRef);

  const modalContent = (
    <>
      {hasBackground && (
        <div
          className="fixed inset-0 bg-font-4/50 z-100"
          style={{ zIndex: overlayZIndex }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onMouseDown={(e) => e.stopPropagation()} // mousedown도 막아주는 것이 안전함
          aria-hidden="true"
        />
      )}

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        style={{ zIndex: modalZIndex }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          "z-101 rounded-xl border border-border-main bg-bg-dark shadow-card-heavy",
          !hasBackground && "px-2 py-3",
          modalPositionClass,
          className,
        )}
      >
        {children}
      </div>
    </>
  );

  if (!isClient) return null; // 서버 사이드에서는 아무것도 그리지 않음

  if (hasBackground) return createPortal(modalContent, document.body);
  return modalContent;
};
