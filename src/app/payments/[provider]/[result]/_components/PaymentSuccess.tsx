"use client";

import React, { useEffect, useState } from "react";
import { animate, m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Token from "@/icons/Token";
import ButtonLink from "@/components/ui/ButtonLink";
import { useWalletStore } from "@/store/useWalletStore";
import { formatWithCommas } from "@/lib/utils";
import { EASE_OUT } from "@/constants/motion";

/* ------------------------------------------------------------------ *
 * 컨페티
 *
 * 렌더 중 Math.random 을 부르면 렌더마다 조각이 바뀌므로, 시드 고정 난수로
 * 모듈 로드 시 한 번만 만든다. 색은 장식이라 테마 토큰 대신 브랜드 오렌지
 * 주변의 따뜻한 색 + 포인트 두 색을 직접 쓴다.
 * ------------------------------------------------------------------ */

const CONFETTI_COLORS = [
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

interface ConfettiPiece {
  x: number;
  peakY: number;
  endY: number;
  rotate: number;
  width: number;
  height: number;
  round: boolean;
  color: string;
  delay: number;
  duration: number;
}

const CONFETTI: ConfettiPiece[] = (() => {
  const random = seeded(20260921);
  return Array.from({ length: 56 }, (_, index) => {
    // 위쪽 반원(-170° ~ -10°)으로 터져 나갔다가 중력처럼 떨어진다.
    const angle = ((-170 + random() * 160) * Math.PI) / 180;
    const distance = 110 + random() * 220;
    const shape = index % 3;
    return {
      x: Math.cos(angle) * distance,
      peakY: Math.sin(angle) * distance,
      endY: Math.sin(angle) * distance + 240 + random() * 180,
      rotate: (random() - 0.5) * 900,
      width: shape === 2 ? 4 : 7,
      height: shape === 0 ? 7 : 12,
      round: shape === 0,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      delay: random() * 0.15,
      duration: 1.6 + random() * 0.9,
    };
  });
})();

const ConfettiBurst = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute top-1/2 left-1/2 z-10"
  >
    {CONFETTI.map((piece, index) => (
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
        initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.4 }}
        animate={{
          x: [0, piece.x, piece.x * 1.15],
          y: [0, piece.peakY, piece.endY],
          rotate: [0, piece.rotate * 0.4, piece.rotate],
          opacity: [0, 1, 1, 0],
          scale: [0.4, 1, 1, 0.8],
        }}
        transition={{
          delay: 0.25 + piece.delay,
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

/* ------------------------------------------------------------------ *
 * 반짝이 — 토큰 주변에서 번갈아 깜빡이는 네 갈래 별
 * ------------------------------------------------------------------ */

const SPARKLES = [
  { top: "8%", left: "14%", size: 18, delay: 0.6 },
  { top: "18%", left: "84%", size: 14, delay: 1.1 },
  { top: "72%", left: "8%", size: 12, delay: 1.5 },
  { top: "80%", left: "80%", size: 20, delay: 0.9 },
  { top: "-4%", left: "58%", size: 11, delay: 1.9 },
  { top: "46%", left: "96%", size: 10, delay: 2.3 },
];

const Sparkle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c.6 5.6 3.4 9.4 12 12-8.6 2.6-11.4 6.4-12 12-.6-5.6-3.4-9.4-12-12C8.6 9.4 11.4 5.6 12 0Z" />
  </svg>
);

/* ------------------------------------------------------------------ *
 * 숫자 카운트업
 * ------------------------------------------------------------------ */

const useCountUp = (target: number, enabled: boolean) => {
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) return;
    const controls = animate(0, target, {
      delay: 0.45,
      duration: 1.1,
      ease: EASE_OUT,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [target, enabled]);

  return enabled ? value : target;
};

/* ------------------------------------------------------------------ *
 * 본문
 * ------------------------------------------------------------------ */

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: EASE_OUT },
});

interface PaymentSuccessProps {
  credits: number;
}

/** 결제 승인 후 노트가 지급됐을 때의 축하 화면 */
const PaymentSuccess = ({ credits }: PaymentSuccessProps) => {
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
  const shownCredits = useCountUp(credits, !reduceMotion);
  const balance = useWalletStore((state) => state.balance?.availableBalance);

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* 배경 글로우 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-[520px] max-w-[100vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--brand-opacity-2)_0%,var(--brand-opacity)_35%,transparent_68%)] blur-2xl"
      />

      {/* 토큰 히어로 */}
      <div className="relative flex size-56 items-center justify-center">
        {/* 천천히 도는 빛줄기 */}
        <m.div
          aria-hidden
          className="absolute inset-0 rounded-full [mask-image:radial-gradient(circle,black_20%,transparent_70%)]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, var(--brand-opacity-2) 0deg 8deg, transparent 8deg 24deg)",
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, rotate: 360 }
          }
          transition={{
            opacity: { duration: 0.6, delay: 0.2 },
            scale: { duration: 0.8, delay: 0.2, ease: EASE_OUT },
            rotate: { duration: 24, ease: "linear", repeat: Infinity },
          }}
        />

        {/* 퍼져 나가는 충격파 링 */}
        {!reduceMotion &&
          [0, 0.35].map((delay) => (
            <m.span
              key={delay}
              aria-hidden
              className="absolute size-28 rounded-full border-2 border-brand"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 2, opacity: [0, 0.7, 0] }}
              transition={{ delay: 0.25 + delay, duration: 1.1, ease: EASE_OUT }}
            />
          ))}

        {/* 반짝이 */}
        {SPARKLES.map((sparkle, index) => (
          <m.span
            key={index}
            aria-hidden
            className="absolute text-brand-dark"
            style={{ top: sparkle.top, left: sparkle.left }}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              reduceMotion
                ? { opacity: 0.8, scale: 1 }
                : { opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 90] }
            }
            transition={{
              delay: sparkle.delay,
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          >
            <Sparkle size={sparkle.size} />
          </m.span>
        ))}

        {/* 토큰: 튀어나온 뒤 둥실 떠 있는다 */}
        <m.div
          className="relative drop-shadow-[0_12px_32px_rgba(255,122,0,0.45)]"
          initial={
            reduceMotion ? false : { scale: 0, rotate: -35, opacity: 0 }
          }
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 14,
            delay: 0.1,
          }}
        >
          <m.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{
              delay: 1,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Token className="size-28" />
          </m.div>
        </m.div>

        {!reduceMotion && <ConfettiBurst />}
      </div>

      {/* 문구 */}
      <m.p {...rise(0.35)} className="title-3 mt-2 text-brand-dark">
        {t("tokenCharge.payment.successTitle")}
      </m.p>

      <m.p
        {...rise(0.45)}
        className="mt-2 flex items-baseline gap-2"
        aria-hidden
      >
        <span className="display-1 bg-gradient-to-br from-[#ffc46b] via-brand to-[#ff5c2e] bg-clip-text text-transparent tabular-nums">
          +{formatWithCommas(shownCredits)}
        </span>
        <span className="heading-3 text-font-0">
          {t("tokenCharge.noteUnit")}
        </span>
      </m.p>

      {/* 카운트업 중인 숫자 대신 최종 문장을 읽어 준다 */}
      <p role="status" className="sr-only">
        {t("tokenCharge.payment.success", {
          credits: formatWithCommas(credits),
        })}
      </p>

      {balance !== undefined && (
        <m.div
          {...rise(0.65)}
          className="mt-6 flex items-center gap-2 rounded-full border border-main bg-card py-2 pr-4 pl-2.5"
        >
          <Token className="size-6" />
          <span className="body-5 text-font-2">
            {t("tokenCharge.payment.balanceLabel")}
          </span>
          <span className="title-5 text-font-0 tabular-nums">
            {formatWithCommas(balance)}
          </span>
        </m.div>
      )}

      <m.div
        {...rise(0.8)}
        className="mt-10 flex w-full max-w-80 flex-col gap-2.5"
      >
        <ButtonLink href="/" size="lg" fullWidth>
          {t("tokenCharge.payment.goExplore")}
        </ButtonLink>
        <ButtonLink href="/token-charge" variant="secondary" size="lg" fullWidth>
          {t("tokenCharge.payment.backToCharge")}
        </ButtonLink>
      </m.div>
    </div>
  );
};

export default PaymentSuccess;
