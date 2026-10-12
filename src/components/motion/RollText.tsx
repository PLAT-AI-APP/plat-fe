"use client";

import { AnimatePresence, m } from "framer-motion";
import { EASE_OUT } from "@/constants/motion";
import { cn } from "@/lib/utils";

interface RollTextProps {
  value: string;
  /** true 면 새 값이 아래에서 올라오고, false 면 위에서 내려온다 */
  up: boolean;
  /**
   * 자리마다 따로 굴린다. 숫자처럼 일부 자리만 바뀌는 값에 쓴다.
   * 오른쪽 끝부터 자리를 맞춰 자릿수가 늘어도 같은 자리끼리 이어진다.
   */
  perChar?: boolean;
  className?: string;
}

const Cell = ({
  char,
  up,
  delay,
}: {
  char: string;
  up: boolean;
  delay: number;
}) => (
  <span className="relative inline-flex overflow-hidden">
    <AnimatePresence mode="popLayout" initial={false}>
      <m.span
        key={char}
        className="inline-block whitespace-pre"
        initial={{ y: up ? "100%" : "-100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: up ? "-100%" : "100%", opacity: 0 }}
        transition={{ duration: 0.32, ease: EASE_OUT, delay }}
      >
        {char}
      </m.span>
    </AnimatePresence>
  </span>
);

/** 값이 바뀔 때 위아래로 굴러 바뀌는 글자·숫자. 처음 그릴 때는 움직이지 않는다. */
const RollText = ({ value, up, perChar = false, className }: RollTextProps) => {
  if (!perChar) {
    return (
      <span className={cn("inline-flex", className)}>
        <Cell char={value} up={up} delay={0} />
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex tabular-nums", className)}
      aria-label={value}
    >
      {value.split("").map((char, index) => {
        const position = value.length - index;
        return (
          <Cell key={position} char={char} up={up} delay={position * 0.03} />
        );
      })}
    </span>
  );
};

export default RollText;
