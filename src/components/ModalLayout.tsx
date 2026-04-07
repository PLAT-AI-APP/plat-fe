import { useClickAway } from "@/hooks/useClickAway";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  hasBackground?: boolean; // 1. 배경 유무 프롭 추가
}

export const ModalLayout = ({
  children,
  onClose,
  className,
  triggerRef,
  hasBackground = false, // 기본값은 false
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = triggerRef ? onClose : () => {};
  useClickAway(modalRef, handleClose, triggerRef);

  return (
    <>
      {/* 배경이 true일 때만 fixed로 어두운 배경을 깝니다. */}
      {hasBackground && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          // onClick={onClose} // 배경 클릭 시 닫힘
          aria-hidden="true"
        />
      )}

      <section
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          `px-2 py-3 right-0 top-full translate-y-2.5 absolute z-21 bg-bg-dark rounded-xl shadow-card-heavy`,
          hasBackground &&
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 right-auto", // 배경이 있는 정식 모달 형태일 경우 중앙 배치 추천 (선택 사항)
          className,
        )}
      >
        {children}
      </section>
    </>
  );
};
