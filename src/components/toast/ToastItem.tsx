"use client";

import { motion, useIsPresent } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { dismissAppToast } from "@/lib/toast";
import {
  useToastStore,
  type ToastData,
  type ToastExitReason,
} from "@/store/useToastStore";
import ToastContentS from "./ToastContentS";

/** 화면 밖(위쪽)에서 미끄러져 들어오는 느낌을 주기 위한 시작 위치입니다. */
const ENTER_FROM_Y = -80;

const MOVE_TRANSITION = { duration: 0.4, ease: [0.32, 0.72, 0, 1] } as const;

/** 퇴장 사유별 fade 길이. timeout(자연 만료)이 가장 느리고, manual(직접 닫기)이 가장 빠릅니다. */
const EXIT_DURATION_BY_REASON: Record<ToastExitReason, number> = {
  timeout: 0.9,
  overflow: 0.48,
  manual: 0.2,
};

interface ToastItemProps {
  toast: ToastData;
  /** 0이 가장 앞(최신). 값이 클수록 뒤로 겹쳐 쌓입니다. */
  rank: number;
  /** ToastManager가 실측 높이를 바탕으로 계산해 내려주는 세로 위치(px). */
  y: number;
}

const ToastItem = ({ toast, rank, y }: ToastItemProps) => {
  const exitReason =
    useToastStore((state) => state.exitReasons[toast.id]) ?? "timeout";
  const cleanupToast = useToastStore((state) => state.cleanupToast);
  const setHeight = useToastStore((state) => state.setHeight);
  const isPresent = useIsPresent();
  const elementRef = useRef<HTMLDivElement>(null);

  // 맨 위(1번째)와 2번째 toast가 절대 겹치지 않도록, 실제 렌더된 높이를 측정해 스토어에
  // 보고합니다. ToastManager가 이 값으로 2번째 자리의 위치를 계산합니다.
  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    setHeight(toast.id, el.getBoundingClientRect().height);
  }, [toast.id, toast.message, toast.description, setHeight]);

  useEffect(() => {
    if (isPresent) return;
    return () => cleanupToast(toast.id);
  }, [isPresent, toast.id, cleanupToast]);

  const handleManualClose = () => dismissAppToast(toast.id);

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, x: "-50%", y: ENTER_FROM_Y }}
      animate={{
        opacity: 1,
        x: "-50%",
        y,
        transition: MOVE_TRANSITION,
      }}
      exit={{
        opacity: 0,
        filter: "blur(2px)",
        transition: {
          duration: EXIT_DURATION_BY_REASON[exitReason],
          ease: "easeInOut",
        },
      }}
      style={{ zIndex: 10 - rank }}
      className={`app-toast-s app-toast-s-${toast.type}`}
    >
      <ToastContentS toast={toast} onConfirm={handleManualClose} />
    </motion.div>
  );
};

export default ToastItem;
