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
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // useEffect + useState 대신 사용하여 성능 경고를 피함
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const handleClose = triggerRef ? onClose : () => {};
  useClickAway(modalRef, handleClose, triggerRef);

  const modalContent = (
    <>
      {hasBackground && (
        <div
          className="fixed inset-0 bg-black/50 z-100"
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
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          "px-2 py-3 right-0 top-full translate-y-2.5 absolute z-101 bg-bg-dark rounded-xl shadow-card-heavy",
          hasBackground &&
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 right-auto",
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
