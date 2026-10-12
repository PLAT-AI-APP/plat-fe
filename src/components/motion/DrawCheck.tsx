"use client";

import { m } from "framer-motion";
import { EASE_OUT } from "@/constants/motion";

interface DrawCheckProps {
  size?: number;
  delay?: number;
  /** 원 없이 체크만 그린다 */
  bare?: boolean;
  strokeWidth?: number;
  className?: string;
}

/** 원과 체크가 차례로 그려지는 완료 표시. 색은 currentColor 를 따른다. */
const DrawCheck = ({
  size = 56,
  delay = 0,
  bare = false,
  strokeWidth,
  className,
}: DrawCheckProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className={className}
  >
    {!bare && (
      <m.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        // 12시 방향에서 시계 방향으로 그려지도록 돌려 둔다
        style={{ rotate: -90, originX: "50%", originY: "50%" }}
        transition={{ delay, duration: 0.45, ease: EASE_OUT }}
      />
    )}
    <m.path
      d={bare ? "M5 12.5l4.5 4.5L19 7.5" : "M7.5 12.3l3 2.9 6-6.2"}
      stroke="currentColor"
      strokeWidth={strokeWidth ?? (bare ? 2.6 : 1.9)}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        delay: bare ? delay : delay + 0.35,
        duration: 0.3,
        ease: "easeOut",
      }}
    />
  </svg>
);

export default DrawCheck;
