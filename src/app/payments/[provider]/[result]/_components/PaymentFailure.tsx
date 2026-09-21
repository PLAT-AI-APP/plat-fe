"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Token from "@/icons/Token";
import ButtonLink from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/constants/motion";

/*
 * 결제가 끝나지 않은 화면.
 *
 * 성공 화면이 "터지는" 연출이라면 여기는 반대로 "가라앉는" 연출이다. 돈이 걸린
 * 자리에서 실패를 요란하게 보여주면 불안만 커지므로, 토큰은 색을 잃고 내려앉고
 * 뱃지 하나로 상태를 알린 뒤, 청구되지 않았다는 사실을 가장 먼저 읽히게 둔다.
 */

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: EASE_OUT },
});

/** 토큰에서 떨어져 나가 흩어지는 조각. 실패일 때만 쓴다. */
const SHARDS = [
  { x: -62, y: -38, rotate: -40, size: 7, delay: 0.52 },
  { x: 58, y: -52, rotate: 55, size: 5, delay: 0.56 },
  { x: -48, y: 46, rotate: 20, size: 5, delay: 0.6 },
  { x: 70, y: 30, rotate: -65, size: 8, delay: 0.54 },
  { x: 8, y: -74, rotate: 80, size: 4, delay: 0.62 },
];

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
    <path
      d="M12 7v6"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17.2" r="1.5" fill="currentColor" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
    <path
      d="M7 7l10 10M17 7 7 17"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

interface PaymentFailureProps {
  variant: "failed" | "cancelled";
  /** 서버가 알려준 실패 사유. 있으면 설명 아래에 덧붙인다. */
  reason?: string;
}

const PaymentFailure = ({ variant, reason }: PaymentFailureProps) => {
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
  const failed = variant === "failed";

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* 배경 글로우 — 실패는 붉게, 취소는 중립으로 */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-24 left-1/2 size-[480px] max-w-[100vw] -translate-x-1/2 rounded-full blur-2xl",
          failed
            ? "bg-[radial-gradient(circle,var(--danger-bg)_0%,transparent_65%)]"
            : "bg-[radial-gradient(circle,var(--bg-card-hover)_0%,transparent_65%)]",
        )}
      />

      {/* 토큰 히어로 */}
      <div className="relative flex size-52 items-center justify-center">
        {/* 끊긴 궤도 — 연결이 끊겼다는 은유 */}
        <motion.div
          aria-hidden
          className={cn(
            "absolute inset-5 rounded-full border-2 border-dashed",
            failed ? "border-danger/35" : "border-main",
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, rotate: -360 }
          }
          transition={{
            opacity: { duration: 0.5, delay: 0.15 },
            scale: { duration: 0.7, delay: 0.15, ease: EASE_OUT },
            rotate: { duration: 40, ease: "linear", repeat: Infinity },
          }}
        />

        {/* 튕겨 나가는 조각 */}
        {failed &&
          !reduceMotion &&
          SHARDS.map((shard, index) => (
            <motion.span
              key={index}
              aria-hidden
              className="absolute rounded-[2px] bg-danger"
              style={{ width: shard.size, height: shard.size }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: shard.x,
                y: [0, shard.y, shard.y + 24],
                opacity: [0, 0.9, 0],
                rotate: shard.rotate,
              }}
              transition={{ delay: shard.delay, duration: 1, ease: EASE_OUT }}
            />
          ))}

        {/* 토큰: 떨어져 내려앉으며 색을 잃는다. 실패면 한 번 흔들린다. */}
        <motion.div
          className="relative"
          initial={reduceMotion ? false : { y: -36, opacity: 0, scale: 0.9 }}
          animate={
            reduceMotion
              ? undefined
              : failed
                ? { y: 0, opacity: 1, scale: 1, x: [0, 0, -9, 8, -6, 4, 0] }
                : { y: 0, opacity: 1, scale: 1 }
          }
          transition={{
            y: { type: "spring", stiffness: 320, damping: 18, delay: 0.05 },
            opacity: { duration: 0.3, delay: 0.05 },
            scale: { duration: 0.4, delay: 0.05 },
            x: { delay: 0.45, duration: 0.5, ease: "easeInOut" },
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { filter: "grayscale(0)" }}
            animate={{
              filter: failed ? "grayscale(0.85)" : "grayscale(1)",
              opacity: failed ? 0.75 : 0.55,
            }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Token className="size-24" />
          </motion.div>

          {/* 상태 뱃지 */}
          <motion.span
            aria-hidden
            className={cn(
              "absolute -right-2 -bottom-1 flex size-9 items-center justify-center rounded-full ring-4 ring-dark",
              failed ? "bg-danger text-white" : "bg-card text-font-2",
            )}
            initial={reduceMotion ? false : { scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 15,
              delay: 0.55,
            }}
          >
            {failed ? <AlertIcon /> : <CloseIcon />}
          </motion.span>

          {/* 뱃지에서 한 번 번지는 경고 파동 */}
          {failed && !reduceMotion && (
            <motion.span
              aria-hidden
              className="absolute -right-2 -bottom-1 size-9 rounded-full bg-danger"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
              transition={{
                delay: 0.75,
                duration: 1.4,
                repeat: 2,
                repeatDelay: 0.6,
                ease: EASE_OUT,
              }}
            />
          )}
        </motion.div>
      </div>

      {/* 문구 */}
      <div role="status" className="flex flex-col items-center">
        <motion.h2 {...rise(0.35)} className="heading-2 text-font-0">
          {t(
            failed
              ? "tokenCharge.payment.failedTitle"
              : "tokenCharge.payment.cancelledTitle",
          )}
        </motion.h2>

        <motion.p
          {...rise(0.45)}
          className="body-4 mt-3 max-w-80 text-font-2 break-keep"
        >
          {t(
            failed
              ? "tokenCharge.payment.failedDescription"
              : "tokenCharge.payment.cancelledDescription",
          )}
        </motion.p>
      </div>

      {failed && reason && (
        <motion.p
          {...rise(0.55)}
          className="body-6 mt-5 max-w-80 rounded-xl bg-danger-bg px-4 py-2.5 text-danger break-keep"
        >
          {reason}
        </motion.p>
      )}

      <motion.div
        {...rise(0.7)}
        className="mt-10 flex w-full max-w-80 flex-col gap-2.5"
      >
        <ButtonLink href="/token-charge" size="lg" fullWidth>
          {t("tokenCharge.payment.retry")}
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" size="lg" fullWidth>
          {t("tokenCharge.payment.goHome")}
        </ButtonLink>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
