"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useClickAway } from "@/hooks/useClickAway";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/utils";
import { TRANSITION_FAST, popVariants } from "@/constants/motion";

/*
 * 여러 ModalLayout이 스택으로 동시에 떠 있을 때(ModalManager) esc 한 번에
 * 전부 닫히지 않도록, 현재 마운트된 인스턴스 중 stackIndex가 가장 큰(맨 위)
 * 것만 esc에 반응하도록 공유 레지스트리로 추적합니다.
 */
const mountedStackIndexes: number[] = [];

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

  /*
   * 배경 모달과 팝오버의 기준 위치가 달라 위치 클래스를 분리한다.
   *
   * 배경 모달에는 화면 밖으로 넘치지 않게 하는 계약을 함께 건다. 이게 없어서
   * 모달이 화면보다 크면 위아래가 잘려 나가고, 잘린 부분에 확인 버튼이 있으면
   * 그 모달은 아예 쓸 수 없었다. base.css 가 body 에 overflow:hidden 을 걸어
   * 페이지를 스크롤해 도달할 수도 없다. 세로 중앙 정렬(top-1/2 + -translate-y-1/2)
   * 이라 넘침이 위아래로 반씩 갈리는 것도 한몫했다.
   *
   * 호출부가 자기 max-w/max-h 를 주면 cn(tailwind-merge)이 그쪽을 살린다.
   * 고정 h-[...] 를 준 모달도 max-height 가 상한으로 작동해 함께 해결된다.
   * dvh 를 쓰는 이유는 모바일 주소창이 접혔다 펴질 때 vh 가 따라오지 않아서다.
   */
  const modalPositionClass = hasBackground
    ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90dvh] max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain"
    : "absolute right-0 top-full translate-y-2.5";

  useClickAway(modalRef, handleClose, triggerRef);

  // 배경을 깐 모달만 화면 전체를 가린다. 그때는 Tab 이 뒤 콘텐츠로 새면 안 되고,
  // 닫힌 뒤에는 열었던 자리로 포커스가 돌아가야 한다.
  // Esc 는 배경 없는 팝오버까지 포함해 아래 효과가 담당하므로 여기서는 넘기지 않는다.
  useFocusTrap({
    containerRef: modalRef,
    enabled: isClient && hasBackground,
  });

  // esc를 누르면 현재 스택에서 가장 위에 있는 모달만 닫습니다.
  useEffect(() => {
    mountedStackIndexes.push(stackIndex);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (stackIndex !== Math.max(...mountedStackIndexes)) return;

      event.stopPropagation();
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      mountedStackIndexes.splice(mountedStackIndexes.indexOf(stackIndex), 1);
    };
  }, [onClose, stackIndex]);

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
