"use client";

import React from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Token from "@/icons/Token";
import ButtonLink from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/constants/motion";

/*
 * 결제 결과를 기다리는 화면.
 *
 * 서버에 묻고 있는 동안(working)에는 토큰 둘레를 빛줄기가 돌고 토큰이 뒤집히며
 * "지금 처리 중"임을 보여준다. 결제 도중 창을 닫으면 곤란하므로 안내 문구는
 * "닫지 말고 기다려 달라"를 먼저 말한다. 더 기다려도 소용없는 상태는 같은
 * 무대에서 움직임을 멈추고 뱃지와 버튼으로 다음 행동을 안내한다.
 */

export type PendingPhase =
  | "confirming"
  | "checking"
  | "granting"
  | "delayed"
  /** PC 에서 결제창을 새 창으로 띄워 두고 기다리는 중 */
  | "popup"
  /** 결제창이 닫혔는데 아직 결과를 받지 못했다 */
  | "popupClosed"
  /** (결제창 안) 결과를 원래 창에 넘겼다 */
  | "handedOff";

type Badge = "warn" | "muted" | "done";

interface PhaseConfig {
  title: string;
  hint: string;
  /** 서버·결제창의 답을 기다리며 움직이는 중인지 */
  working: boolean;
  badge?: Badge;
  /** actions 를 따로 넘기지 않았을 때 충전 페이지·홈 버튼을 보여줄지 */
  links?: boolean;
}

const PHASES: Record<PendingPhase, PhaseConfig> = {
  confirming: {
    title: "tokenCharge.payment.confirmingTitle",
    hint: "tokenCharge.payment.confirmingHint",
    working: true,
  },
  checking: {
    title: "tokenCharge.payment.confirmingTitle",
    hint: "tokenCharge.payment.checkingHint",
    working: true,
  },
  // 결제는 끝났고 노트 지급만 남았다. 계속 확인하되 기다리지 않아도 되게 버튼을 준다.
  granting: {
    title: "tokenCharge.payment.grantingTitle",
    hint: "tokenCharge.payment.grantingHint",
    working: true,
    links: true,
  },
  delayed: {
    title: "tokenCharge.payment.delayedTitle",
    hint: "tokenCharge.payment.delayedHint",
    working: false,
    badge: "warn",
    links: true,
  },
  popup: {
    title: "tokenCharge.payment.popupTitle",
    hint: "tokenCharge.payment.popupHint",
    working: true,
  },
  popupClosed: {
    title: "tokenCharge.payment.popupClosedTitle",
    hint: "tokenCharge.payment.popupClosedHint",
    working: false,
    badge: "muted",
  },
  handedOff: {
    title: "tokenCharge.payment.handedOffTitle",
    hint: "tokenCharge.payment.handedOffHint",
    working: false,
    badge: "done",
  },
};

const BADGE_CLASS: Record<Badge, string> = {
  warn: "bg-warning text-on-brand",
  muted: "bg-card text-font-2",
  done: "bg-brand text-on-brand",
};

/** 토큰 둘레를 서로 다른 속도로 도는 빛 알갱이 */
const ORBITERS = [
  { inset: "inset-2", size: 6, duration: 3.2, delay: 0 },
  { inset: "inset-7", size: 4, duration: 2.4, delay: -0.8 },
  { inset: "-inset-1", size: 5, duration: 4.6, delay: -2.1 },
];

/** 두께 3px 짜리 고리만 남기는 마스크 */
const RING_MASK =
  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))";

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" />
    <path
      d="M12 8v4.2l2.8 1.8"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WindowIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
    <rect
      x="4"
      y="5"
      width="16"
      height="14"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M4 9.5h16" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
    <path
      d="m6 12.5 4 4 8-9"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BADGE_ICON: Record<Badge, React.ReactNode> = {
  warn: <ClockIcon />,
  muted: <WindowIcon />,
  done: <CheckIcon />,
};

/** 제목 뒤에서 차례로 튀는 점 세 개 */
const BouncingDots = () => (
  <span aria-hidden className="ml-1 inline-flex gap-1 align-middle">
    {[0, 1, 2].map((index) => (
      <m.span
        key={index}
        className="size-1.5 rounded-full bg-brand"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          delay: index * 0.15,
          ease: "easeInOut",
        }}
      />
    ))}
  </span>
);

interface PaymentPendingProps {
  phase: PendingPhase;
  /** 기본 버튼(충전 페이지·홈) 대신 보여줄 버튼. 결제창 대기처럼 동작이 필요한 자리에서 쓴다. */
  actions?: React.ReactNode;
}

const PaymentPending = ({ phase, actions }: PaymentPendingProps) => {
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
  const config = PHASES[phase];
  const { working, badge } = config;
  const moving = working && !reduceMotion;

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* 숨 쉬듯 커졌다 작아지는 배경 빛 */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-[480px] max-w-[100vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--brand-opacity-2)_0%,var(--brand-opacity)_35%,transparent_66%)] blur-2xl"
        initial={{ opacity: 0 }}
        animate={
          moving
            ? { opacity: [0.55, 1, 0.55], scale: [0.94, 1.04, 0.94] }
            : { opacity: working ? 1 : 0.5 }
        }
        transition={
          moving
            ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.6 }
        }
      />

      {/* 토큰 무대 */}
      <div className="relative flex size-52 items-center justify-center">
        {/* 바깥 점선 궤도 — 반대 방향으로 천천히 */}
        <m.div
          aria-hidden
          className="absolute -inset-1 rounded-full border border-dashed border-main"
          animate={moving ? { rotate: -360 } : undefined}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        />

        {/* 고리 트랙 */}
        <div
          aria-hidden
          className="absolute inset-4 rounded-full border-[3px] border-card"
        />

        {/* 꼬리가 옅어지는 빛줄기 + 앞머리 빛점 */}
        <m.div
          aria-hidden
          className="absolute inset-4"
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
                "conic-gradient(from 0deg, transparent 0deg, var(--brand-opacity-2) 150deg, var(--brand) 300deg, transparent 300deg)",
              WebkitMask: RING_MASK,
              mask: RING_MASK,
            }}
          />
          {working && (
            <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-[3px] rounded-full bg-[#ffd27a] shadow-[0_0_12px_4px_rgba(255,122,0,0.7)]" />
          )}
        </m.div>

        {/* 둘레를 도는 빛 알갱이 */}
        {moving &&
          ORBITERS.map((orbiter, index) => (
            <m.div
              key={index}
              aria-hidden
              className={cn("absolute", orbiter.inset)}
              animate={{ rotate: 360 }}
              transition={{
                duration: orbiter.duration,
                delay: orbiter.delay,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-brand-dark opacity-70"
                style={{ width: orbiter.size, height: orbiter.size }}
              />
            </m.div>
          ))}

        {/* 토큰: 확인 중에는 동전처럼 뒤집히며 둥실 뜬다 */}
        <m.div
          className="relative [perspective:600px]"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <m.div
            animate={moving ? { y: [0, -6, 0] } : { y: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <m.div
              className={cn(
                "drop-shadow-[0_10px_24px_rgba(255,122,0,0.35)] transition-[filter,opacity] duration-slow",
                (phase === "delayed" || phase === "popupClosed") &&
                  "opacity-70 grayscale-[0.6]",
              )}
              animate={moving ? { rotateY: [0, 0, 360] } : { rotateY: 0 }}
              transition={{
                duration: 2.2,
                times: [0, 0.35, 1],
                repeat: Infinity,
                ease: EASE_OUT,
              }}
            >
              <Token className="size-24" />
            </m.div>
          </m.div>

          {/* 멈춘 상태는 뱃지 하나로 "왜 멈췄는지"를 알린다 */}
          <AnimatePresence>
            {badge && (
              <m.span
                key={badge}
                aria-hidden
                className={cn(
                  "absolute -right-2 -bottom-1 flex size-9 items-center justify-center rounded-full ring-4 ring-dark",
                  BADGE_CLASS[badge],
                )}
                initial={reduceMotion ? false : { scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                {BADGE_ICON[badge]}
              </m.span>
            )}
          </AnimatePresence>
        </m.div>
      </div>

      {/* 문구 */}
      <div role="status" className="mt-2 flex flex-col items-center">
        <h2 className="heading-2 text-font-0">
          {t(config.title)}
          {working && <BouncingDots />}
        </h2>

        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={phase}
            className="body-4 mt-3 max-w-80 text-font-2 break-keep"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            {t(config.hint)}
          </m.p>
        </AnimatePresence>
      </div>

      {/* 끝을 모르는 진행 막대 */}
      {working && (
        <div
          aria-hidden
          className="relative mt-8 h-1 w-48 overflow-hidden rounded-full bg-card"
        >
          <m.span
            className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent"
            animate={reduceMotion ? { x: "100%" } : { x: ["-100%", "300%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {(actions || config.links) && (
        <m.div
          className="mt-10 flex w-full max-w-80 flex-col gap-2.5"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT }}
        >
          {actions ?? (
            <>
              <ButtonLink href="/token-charge" size="lg" fullWidth>
                {t("tokenCharge.payment.backToCharge")}
              </ButtonLink>
              <ButtonLink href="/" variant="secondary" size="lg" fullWidth>
                {t("tokenCharge.payment.goHome")}
              </ButtonLink>
            </>
          )}
        </m.div>
      )}
    </div>
  );
};

export default PaymentPending;
