"use client";

import { m } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** 컨페티 색. 브랜드 오렌지 주변의 따뜻한 색 + 포인트 두 색(결제 완료 연출과 같다). */
export const CONFETTI_COLORS = [
  "#ff7a00",
  "#ffa53c",
  "#ffd27a",
  "#fff4dc",
  "#ff5c8a",
  "#8b7bff",
];

const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** 렌더마다 조각이 바뀌지 않도록 시드 고정 난수로 한 번만 만든다 */
const makePieces = (count: number, spread: number, seed: number) => {
  const random = seeded(seed);
  return Array.from({ length: count }, (_, index) => {
    const angle = ((-160 + random() * 140) * Math.PI) / 180;
    const distance = spread * (0.45 + random() * 0.55);
    const shape = index % 3;
    return {
      x: Math.cos(angle) * distance,
      peakY: Math.sin(angle) * distance,
      endY: Math.sin(angle) * distance + spread * (0.9 + random() * 0.6),
      rotate: (random() - 0.5) * 720,
      width: shape === 2 ? 3 : 6,
      height: shape === 0 ? 6 : 10,
      round: shape === 0,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      delay: random() * 0.12,
      duration: 1.3 + random() * 0.7,
    };
  });
};

interface MiniConfettiProps {
  count?: number;
  /** 터져 나가는 거리(px) */
  spread?: number;
  delay?: number;
  seed?: number;
  /** 터지는 자리. 부모(relative) 기준으로 top-1/2 left-1/2 처럼 준다. */
  className?: string;
}

/**
 * 다이얼로그·모달 안에서 터지는 작은 컨페티.
 * 화면 전체 축하는 PaymentSuccess 의 ConfettiBurst 를 쓴다.
 */
const MiniConfetti = ({
  count = 22,
  spread = 150,
  delay = 0.35,
  seed = 20261012,
  className,
}: MiniConfettiProps) => {
  const [pieces] = useState(() => makePieces(count, spread, seed));
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute z-10", className)}
    >
      {pieces.map((piece, index) => (
        <m.span
          key={index}
          className="absolute block"
          style={{
            width: piece.width,
            height: piece.height,
            marginLeft: -piece.width / 2,
            marginTop: -piece.height / 2,
            backgroundColor: piece.color,
            borderRadius: piece.round ? "9999px" : "2px",
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: [0, piece.x, piece.x * 1.1],
            y: [0, piece.peakY, piece.endY],
            rotate: [0, piece.rotate * 0.4, piece.rotate],
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 1, 0.8],
          }}
          transition={{
            delay: delay + piece.delay,
            duration: piece.duration,
            times: [0, 0.3, 1],
            ease: ["easeOut", "easeIn"],
            opacity: { times: [0, 0.08, 0.75, 1], duration: piece.duration },
            scale: { times: [0, 0.2, 0.8, 1], duration: piece.duration },
          }}
        />
      ))}
    </div>
  );
};

export default MiniConfetti;
