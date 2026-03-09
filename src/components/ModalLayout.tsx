"use client";

import { useClickAway } from "@/hooks/useClickAway";
import { useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>; // 모달을 여는 버튼의 ref
}

export const ModalLayout = ({
  children,
  onClose,
  className,
  triggerRef,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 생성한 ref를 훅에 전달
  useClickAway(modalRef, onClose, triggerRef);

  return (
    <div
      ref={modalRef}
      className={`absolute z-10 bg-bg-dark rounded-xl shadow-card-heavy ${className || ""}`}
    >
      {children}
    </div>
  );
};
