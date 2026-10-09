"use client";

import React, { useId } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/*
 * 성인인증의 얼굴. 붉은빛에서 브랜드 오렌지로 번지는 방패 안에 "19" 가 새겨져 있다.
 *
 * 노트 결제 대기 화면(PaymentPending)과 같은 무대 문법을 쓴다 — 기다리는 동안(working)에는 둘레를 빛줄기가
 * 돌고 방패가 둥실 뜨며, 멈춘 상태는 오른쪽 아래 뱃지 하나로 "왜 멈췄는지"를 알린다.
 */

export type AdultEmblemBadge = "done" | "locked" | "warn";

const SIZE = {
  /** 모달·결과 화면의 주인공 */
  lg: { stage: "size-44", shield: 88, badge: "size-9", glow: true },
  /** 게이트·잠금 화면 */
  md: { stage: "size-28", shield: 60, badge: "size-7", glow: true },
  /** 목록 한 줄·카드 */
  sm: { stage: "size-12", shield: 30, badge: "size-4", glow: false },
} as const;

const RING_MASK =
  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[55%]" fill="none" aria-hidden>
    <path
      d="m6 12.5 4 4 8-9"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[52%]" fill="none" aria-hidden>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.4" fill="currentColor" />
    <path
      d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const WarnIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[55%]" fill="none" aria-hidden>
    <path d="M12 7.5v6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1.6" fill="currentColor" />
  </svg>
);

const BADGE: Record<AdultEmblemBadge, { className: string; icon: React.ReactNode }> = {
  done: { className: "bg-brand text-on-brand", icon: <CheckIcon /> },
  locked: { className: "bg-card text-font-1", icon: <LockIcon /> },
  warn: { className: "bg-warning text-on-brand", icon: <WarnIcon /> },
};

/** 방패 그림. 그라데이션 id 가 화면에 여러 개 떠도 겹치지 않게 useId 로 만든다. */
const Shield = ({ size, tone }: { size: number; tone: "vivid" | "dim" | "muted" }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 100 112"
      aria-hidden
      className={cn(
        "transition-[filter,opacity] duration-slow",
        tone === "dim" && "opacity-90 saturate-[0.85]",
        tone === "muted" && "opacity-70 grayscale-[0.75]",
      )}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4d5a" />
          <stop offset="58%" stopColor="#ff6a2a" />
          <stop offset="100%" stopColor="#ff9a3c" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M50 3 89 17.5v32.7c0 26.2-16.6 46.2-39 58.8-22.4-12.6-39-32.6-39-58.8V17.5L50 3Z"
        fill={`url(#${id}-fill)`}
      />
      <path
        d="M50 3 89 17.5v32.7c0 26.2-16.6 46.2-39 58.8-22.4-12.6-39-32.6-39-58.8V17.5L50 3Z"
        fill={`url(#${id}-shine)`}
      />
      <path
        d="M50 12.5 80.5 23.8v26.4c0 20.4-12.4 36.6-30.5 47.6-18.1-11-30.5-27.2-30.5-47.6V23.8L50 12.5Z"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.35"
        strokeWidth="1.6"
      />
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fill="#fff"
        fontSize="38"
        fontWeight="800"
        letterSpacing="-1.5"
        fontFamily="Pretendard, system-ui, sans-serif"
      >
        19
      </text>
    </svg>
  );
};

interface AdultEmblemProps {
  size?: keyof typeof SIZE;
  /** 인증 창·서버의 답을 기다리는 중. 빛줄기가 돌고 방패가 둥실 뜬다. */
  working?: boolean;
  badge?: AdultEmblemBadge;
  className?: string;
}

const AdultEmblem = ({ size = "lg", working = false, badge, className }: AdultEmblemProps) => {
  const reduceMotion = useReducedMotion() ?? false;
  const config = SIZE[size];
  const moving = working && !reduceMotion;
  // 잠금은 "아직 열지 않은 것" 이라 색은 살리고, 경고(미성년·실패)만 회색으로 가라앉힌다.
  const tone = badge === "warn" ? "muted" : badge === "locked" ? "dim" : "vivid";
  const muted = tone === "muted";

  return (
    <div className={cn("relative flex items-center justify-center", config.stage, className)}>
      {config.glow && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,77,90,0.22)_0%,var(--brand-opacity)_38%,transparent_68%)] blur-xl"
          animate={
            moving
              ? { opacity: [0.55, 1, 0.55], scale: [0.94, 1.05, 0.94] }
              : { opacity: muted ? 0.35 : 0.85 }
          }
          transition={
            moving ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }
          }
        />
      )}

      {size !== "sm" && (
        <>
          <m.div
            aria-hidden
            className="absolute -inset-1 rounded-full border border-dashed border-main"
            animate={moving ? { rotate: -360 } : undefined}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          />
          <div aria-hidden className="absolute inset-3 rounded-full border-[3px] border-card" />
          <m.div
            aria-hidden
            className="absolute inset-3"
            animate={moving ? { rotate: 360 } : undefined}
            transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-opacity duration-slow",
                !working && "opacity-0",
              )}
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(255,77,90,0.25) 140deg, #ff5a4a 250deg, var(--brand) 300deg, transparent 300deg)",
                WebkitMask: RING_MASK,
                mask: RING_MASK,
              }}
            />
            {working && (
              <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-[3px] rounded-full bg-[#ffd27a] shadow-[0_0_12px_4px_rgba(255,90,74,0.7)]" />
            )}
          </m.div>
        </>
      )}

      <m.div
        className="relative"
        initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <m.div
          className="drop-shadow-[0_10px_24px_rgba(255,77,90,0.35)]"
          animate={moving ? { y: [0, -6, 0] } : { y: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Shield size={config.shield} tone={tone} />
        </m.div>

        <AnimatePresence>
          {badge && (
            <m.span
              key={badge}
              aria-hidden
              className={cn(
                "absolute -right-2 -bottom-1 flex items-center justify-center rounded-full ring-4 ring-dark",
                config.badge,
                BADGE[badge].className,
              )}
              initial={reduceMotion ? false : { scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 15, delay: 0.15 }}
            >
              {BADGE[badge].icon}
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
};

export default AdultEmblem;
