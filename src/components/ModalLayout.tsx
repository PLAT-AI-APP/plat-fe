import { useClickAway } from "@/hooks/useClickAway";
import { cn } from "@/lib/utils";
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

  // triggerRef가 있을 때만 onClose를 실행하고, 없으면 아무것도 안 하는 빈 함수를 전달
  // 이렇게 하면 훅 내부에서 이벤트가 발생해도 onClose가 호출되지 않습니다.
  const handleClose = triggerRef ? onClose : () => {};

  useClickAway(modalRef, handleClose, triggerRef);

  return (
    <section
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className={cn(
        `px-2 py-3 right-0 top-full translate-y-2.5 absolute z-10 bg-bg-dark rounded-xl shadow-card-heavy`,
        className,
      )}
    >
      {children}
    </section>
  );
};
