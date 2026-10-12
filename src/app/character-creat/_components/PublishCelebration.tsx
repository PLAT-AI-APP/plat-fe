"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ConfettiBurst } from "@/app/payments/[provider]/[result]/_components/PaymentSuccess";
import Sparkles from "@/components/motion/Sparkles";
import { EASE_OUT } from "@/constants/motion";

/** 자동으로 상세로 넘어가기까지. 버튼을 누르면 바로 넘어간다. */
const AUTO_LEAVE_MS = 4200;
/** 버튼 위 남은 시간 막대가 차기 시작하는 때(카드·제목이 다 자리 잡은 뒤) */
const PROGRESS_DELAY_S = 1.2;

const SPARKLES = [
  { top: "16%", left: "30%", size: 16, delay: 1.2 },
  { top: "26%", left: "68%", size: 20, delay: 1.5 },
  { top: "50%", left: "24%", size: 12, delay: 1.8 },
  { top: "44%", left: "74%", size: 12, delay: 2.0 },
];

/** 아래에서 위로 천천히 떠오르는 별가루 */
const DUST = Array.from({ length: 14 }, (_, index) => ({
  left: `${8 + ((index * 53) % 84)}%`,
  size: 2 + (index % 3),
  delay: 0.8 + (index % 7) * 0.35,
  duration: 3.2 + (index % 4) * 0.5,
}));

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: EASE_OUT },
});

interface PublishCelebrationProps {
  /** 대표 이미지 미리보기 주소 */
  imageUrl: string;
  isPublic: boolean;
  /** 상세로 넘어간다. 자동·버튼 둘 다 이걸 부른다. */
  onLeave: () => void;
}

/**
 * 캐릭터를 새로 등록했을 때의 전체 화면 연출.
 * 카드가 떠오르고 빛이 지나간 뒤 공개 캐릭터면 신작 뱃지가 도장처럼 찍히고 컨페티가 터진다.
 * 수정 저장은 지금처럼 토스트만 띄운다.
 */
const PublishCelebration = ({
  imageUrl,
  isPublic,
  onLeave,
}: PublishCelebrationProps) => {
  const t = useTranslations("characterCreate.publish");

  useEffect(() => {
    const timer = setTimeout(onLeave, AUTO_LEAVE_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") onLeave();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [onLeave]);

  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-celebration-title"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-dark px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <m.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_42%,var(--brand-opacity-2)_0%,var(--brand-opacity)_45%,transparent_80%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      {DUST.map((dot, index) => (
        <m.span
          key={index}
          aria-hidden
          className="absolute bottom-0 rounded-full bg-brand"
          style={{ left: dot.left, width: dot.size, height: dot.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-70vh", opacity: [0, 0.8, 0] }}
          transition={{
            delay: dot.delay,
            duration: dot.duration,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 카드 히어로 */}
      <div className="relative flex h-[290px] w-full items-center justify-center">
        <m.div
          aria-hidden
          className="absolute size-[380px] rounded-full [mask-image:radial-gradient(circle,black_18%,transparent_66%)]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, var(--brand-opacity-2) 0deg 7deg, transparent 7deg 22deg)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.6, delay: 0.4 },
            scale: { duration: 0.9, delay: 0.4, ease: EASE_OUT },
            rotate: { duration: 30, ease: "linear", repeat: Infinity },
          }}
        />

        <m.div
          className="relative"
          initial={{ y: 120, scale: 0.8, opacity: 0, rotate: -4 }}
          animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 17,
            delay: 0.1,
          }}
        >
          <m.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.6,
            }}
          >
            <div className="relative h-[250px] w-[180px] overflow-hidden rounded-2xl bg-card shadow-[0_18px_40px_-12px_rgba(255,122,0,0.45)]">
              {/* 고른 이미지의 미리보기(blob·data 주소)라 next/image 최적화를 거칠 수 없다 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="size-full object-cover" />
              <m.div
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                initial={{ x: "0%" }}
                animate={{ x: "400%" }}
                transition={{ delay: 0.9, duration: 0.9, ease: "easeInOut" }}
              />
            </div>
            {/* 신작 뱃지가 도장처럼 찍힌다(공개 캐릭터만 신작으로 노출된다) */}
            {isPublic && (
              <m.div
                className="absolute -top-4 -left-4"
                initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  delay: 1.15,
                  type: "spring",
                  stiffness: 420,
                  damping: 16,
                }}
              >
                <m.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-[#ff5c8a]"
                  initial={{ scale: 1, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ delay: 1.25, duration: 0.7, ease: "easeOut" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/badges/new.svg"
                  alt=""
                  className="relative size-11 drop-shadow-md"
                />
              </m.div>
            )}
          </m.div>
        </m.div>
        <Sparkles spots={SPARKLES} />
        <ConfettiBurst />
      </div>

      <div className="relative mt-4 flex w-full max-w-80 flex-col items-center text-center">
        <m.h1
          id="publish-celebration-title"
          className="heading-2 text-font-0 break-keep"
          {...rise(0.7)}
        >
          {isPublic ? t("titlePublic") : t("titlePrivate")}
        </m.h1>
        <m.p className="body-4 mt-2 text-font-2 break-keep" {...rise(0.8)}>
          {isPublic ? t("descriptionPublic") : t("descriptionPrivate")}
        </m.p>
        <m.div className="mt-6 w-full" {...rise(1.0)}>
          <button
            type="button"
            autoFocus
            onClick={onLeave}
            className="title-4 relative h-12 w-full overflow-hidden rounded-xl bg-brand text-on-brand"
          >
            {/* 저절로 넘어가기까지 남은 시간 */}
            <m.span
              aria-hidden
              className="absolute inset-y-0 left-0 bg-white/20"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                delay: PROGRESS_DELAY_S,
                duration: AUTO_LEAVE_MS / 1000 - PROGRESS_DELAY_S,
                ease: "linear",
              }}
            />
            <span className="relative inline-flex items-center gap-1.5">
              {t("goToCharacter")}
              <m.svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                aria-hidden
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.4,
                }}
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </m.svg>
            </span>
          </button>
        </m.div>
      </div>
    </m.div>,
    document.body,
  );
};

export default PublishCelebration;
