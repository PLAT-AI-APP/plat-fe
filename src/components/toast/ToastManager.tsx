"use client";

import { AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/useToastStore";
import ToastItem from "./ToastItem";

/** toast 사이 여백. */
const GAP = 16;
/** 앞 toast의 높이가 아직 실측되기 전(첫 렌더) 다음 자리 위치 계산에 쓰는 기본값. */
const FALLBACK_HEIGHT = 90;

const ToastManager = () => {
  const toasts = useToastStore((state) => state.toasts);
  const heights = useToastStore((state) => state.heights);
  // 배열은 오래된 순으로 쌓이므로, 최신 toast가 위(anchor)에 오도록 뒤집어서 렌더링합니다.
  const orderedToasts = [...toasts].reverse();

  // 각 자리는 그 앞의 모든 toast들의 실측 높이를 누적해서 계산합니다. 고정값 대신
  // 실측 높이를 쓰기 때문에 설명 유무·s/m 사이즈로 높이가 달라져도 toast끼리 절대
  // 겹치지 않습니다.
  const yByRank = orderedToasts.map((_, index) =>
    orderedToasts
      .slice(0, index)
      .reduce((sum, t) => sum + (heights[t.id] ?? FALLBACK_HEIGHT) + GAP, 0),
  );

  return (
    <div className="app-toast-viewport">
      <AnimatePresence>
        {orderedToasts.map((toast, rank) => (
          <ToastItem key={toast.id} toast={toast} rank={rank} y={yByRank[rank]} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastManager;
