"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn, formatWithCommas } from "@/lib/utils";
import RollText from "./RollText";

interface AnimatedBalanceProps {
  /** 노트 잔액. 아직 모르면 undefined(0 으로 그린다). */
  value: number | undefined;
  /** 숫자 앞 노트 아이콘. 충전되면 한 번 까딱한다. */
  icon: ReactNode;
  /** 숫자 글자 모양 */
  className?: string;
}

/**
 * 헤더·채팅 사이드바의 노트 잔액.
 * 쓰면 "−12"가 옅게 내려가며 사라지고 숫자가 자리마다 굴러 줄어든다. 충전되면 "+1,000"이 떠오르고 아이콘이 까딱한다.
 * 잔액을 읽는 데 방해되지 않게 1초 남짓으로 끝낸다. 처음 불러올 때(모름 → 잔액)는 움직이지 않는다.
 */
const AnimatedBalance = ({ value, icon, className }: AnimatedBalanceProps) => {
  const [shown, setShown] = useState(value);
  const [delta, setDelta] = useState<{ id: number; amount: number } | null>(
    null,
  );
  if (shown !== value) {
    setShown(value);
    if (shown !== undefined && value !== undefined) {
      setDelta({ id: (delta?.id ?? 0) + 1, amount: value - shown });
    }
  }

  const isGain = (delta?.amount ?? 0) > 0;

  return (
    <span className="relative inline-flex min-w-0 items-center gap-1">
      <m.span
        className="inline-flex shrink-0"
        animate={
          delta
            ? isGain
              ? { rotate: [0, -16, 12, 0], scale: [1, 1.18, 1] }
              : { scale: [1, 0.86, 1] }
            : {}
        }
        transition={{ duration: 0.45 }}
        key={delta?.id ?? 0}
      >
        {icon}
      </m.span>
      <span className={cn("min-w-0 overflow-hidden", className)}>
        <RollText value={formatWithCommas(value ?? 0)} up={isGain} perChar />
      </span>
      <AnimatePresence>
        {delta && delta.amount !== 0 && (
          <m.span
            key={delta.id}
            aria-hidden
            className={cn(
              "title-5 pointer-events-none absolute top-full right-0 mt-0.5 whitespace-nowrap",
              isGain ? "text-brand" : "text-font-2",
            )}
            // 옆 버튼을 가리지 않게 숫자 바로 아래에 뜬다. 쓴 건 아래로 빠지고, 들어온 건 숫자 쪽으로 올라간다.
            initial={{ opacity: 0, y: isGain ? 10 : -4 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: isGain ? [10, 4, 0, -6] : [-4, 0, 4, 10],
            }}
            transition={{ duration: 1.4, times: [0, 0.15, 0.65, 1] }}
            onAnimationComplete={() =>
              setDelta((current) => (current?.id === delta.id ? null : current))
            }
          >
            {isGain
              ? `+${formatWithCommas(delta.amount)}`
              : `−${formatWithCommas(Math.abs(delta.amount))}`}
          </m.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default AnimatedBalance;
