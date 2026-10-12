"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";

/** 네 갈래 반짝이. 결제 완료 연출(PaymentSuccess)과 같은 모양이다. */
export const SparkleShape = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c.6 5.6 3.4 9.4 12 12-8.6 2.6-11.4 6.4-12 12-.6-5.6-3.4-9.4-12-12C8.6 9.4 11.4 5.6 12 0Z" />
  </svg>
);

export interface SparkleSpot {
  top: string;
  left: string;
  size: number;
  delay: number;
}

interface SparklesProps {
  spots: SparkleSpot[];
  /** 끄면 한 번만 반짝이고 끝난다 */
  repeat?: boolean;
  className?: string;
}

/** 지정한 자리에서 번갈아 반짝이는 별들. 부모가 relative 여야 한다. */
const Sparkles = ({ spots, repeat = true, className }: SparklesProps) => (
  <div
    aria-hidden
    className={cn("pointer-events-none absolute inset-0", className)}
  >
    {spots.map((spot, index) => (
      <m.span
        key={index}
        className="absolute text-brand"
        style={{ top: spot.top, left: spot.left }}
        initial={{ scale: 0, opacity: 0, rotate: -30 }}
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [-30, 0, 30] }}
        transition={{
          delay: spot.delay,
          duration: 1.4,
          ease: "easeInOut",
          repeat: repeat ? Infinity : 0,
          repeatDelay: 1.2 + (index % 3) * 0.4,
        }}
      >
        <SparkleShape size={spot.size} />
      </m.span>
    ))}
  </div>
);

export default Sparkles;
