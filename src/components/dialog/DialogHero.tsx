"use client";

import { m } from "framer-motion";
import MiniConfetti from "@/components/motion/MiniConfetti";
import Sparkles from "@/components/motion/Sparkles";
import EmptyMascot from "@/components/state/EmptyMascot";
import { EASE_OUT } from "@/constants/motion";
import Token from "@/icons/Token";
import { cn } from "@/lib/utils";

/**
 * 다이얼로그 제목 위 연출 띠(Dialog 의 hero).
 *
 * cheer        가입 완료 — 마스코트 만세 + 작은 컨페티
 * welcomeNote  웰컴 노트 — 노트가 떨어져 통 튀고 작은 노트가 흩어진다(결제 완료와 같은 빛줄기)
 * creditEmpty  노트 부족 — 시무룩한 마스코트 + 흐려진 노트가 흔들린다. 브랜드 빛 없이 차분하게
 * wave         로그인 필요 — 마스코트가 손을 흔든다
 */
export type DialogHeroVariant =
  "cheer" | "welcomeNote" | "creditEmpty" | "wave";

/** 마스코트가 띠 바닥선 뒤에서 몸을 내민다 */
const Band = ({
  glow,
  className,
  children,
}: {
  glow: "brand" | "neutral";
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "relative flex h-40 items-end justify-center overflow-hidden",
      className,
    )}
  >
    <m.div
      aria-hidden
      className={cn(
        "absolute inset-0",
        glow === "brand"
          ? "bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,var(--brand-opacity-2)_0%,var(--brand-opacity)_40%,transparent_75%)]"
          : "bg-[radial-gradient(ellipse_55%_75%_at_50%_100%,var(--mascot-halo)_0%,transparent_75%)] opacity-70",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: glow === "brand" ? 1 : 0.7 }}
      transition={{ duration: 0.8 }}
    />
    <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-main" />
    {children}
  </div>
);

const CHEER_SPARKLES = [
  { top: "18%", left: "20%", size: 14, delay: 0.7 },
  { top: "10%", left: "72%", size: 18, delay: 0.95 },
  { top: "48%", left: "12%", size: 10, delay: 1.3 },
  { top: "40%", left: "84%", size: 12, delay: 1.1 },
];

/** 큰 노트 둘레로 튀어나왔다 떨어지는 작은 노트 */
const SIDE_NOTES = [
  { x: -96, y: -18, size: 26, rotate: -28, delay: 0.75 },
  { x: 92, y: -30, size: 22, rotate: 24, delay: 0.82 },
  { x: -60, y: -62, size: 18, rotate: -12, delay: 0.9 },
  { x: 64, y: -66, size: 16, rotate: 18, delay: 0.95 },
];

const NOTE_SPARKLES = [
  { top: "14%", left: "30%", size: 14, delay: 1.0 },
  { top: "22%", left: "66%", size: 18, delay: 1.25 },
  { top: "56%", left: "22%", size: 10, delay: 1.5 },
  { top: "60%", left: "74%", size: 12, delay: 1.7 },
];

const WelcomeNote = () => (
  <div
    aria-hidden
    className="relative flex h-44 items-center justify-center overflow-hidden"
  >
    <m.div
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,var(--brand-opacity-2)_0%,var(--brand-opacity)_35%,transparent_70%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    />
    <m.div
      className="absolute size-56 rounded-full [mask-image:radial-gradient(circle,black_15%,transparent_68%)]"
      style={{
        background:
          "repeating-conic-gradient(from 0deg, var(--brand-opacity-2) 0deg 8deg, transparent 8deg 24deg)",
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, rotate: 360 }}
      transition={{
        opacity: { duration: 0.6, delay: 0.3 },
        scale: { duration: 0.8, delay: 0.3, ease: EASE_OUT },
        rotate: { duration: 24, ease: "linear", repeat: Infinity },
      }}
    />
    <m.div
      className="relative"
      initial={{ y: -150, rotate: -25, scale: 0.6 }}
      animate={{ y: 0, rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
    >
      <m.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
      >
        <Token className="size-20 drop-shadow-[0_8px_18px_rgba(255,122,0,0.35)]" />
      </m.div>
    </m.div>
    {SIDE_NOTES.map((note, index) => (
      <m.div
        key={index}
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          marginLeft: -note.size / 2,
          marginTop: -note.size / 2,
        }}
        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
        animate={{
          x: note.x,
          y: [0, note.y, note.y + 4],
          scale: 1,
          opacity: [0, 1, 0.85],
          rotate: note.rotate,
        }}
        transition={{ delay: note.delay, duration: 0.7, ease: EASE_OUT }}
      >
        <Token style={{ width: note.size, height: note.size }} />
      </m.div>
    ))}
    <Sparkles spots={NOTE_SPARKLES} />
    <div className="absolute inset-x-0 bottom-0 h-px bg-main" />
  </div>
);

const DialogHero = ({ variant }: { variant: DialogHeroVariant }) => {
  if (variant === "welcomeNote") return <WelcomeNote />;

  if (variant === "creditEmpty") {
    return (
      <Band glow="neutral">
        {/* 비어 버린 노트 — 흐린 노트가 내려와 흔들리고, 점선 테두리만 남는다 */}
        <m.div
          aria-hidden
          className="absolute top-5 right-[24%] flex size-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--mascot-line)]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0, rotate: [0, 0, -16, 12, -8, 0] }}
          transition={{
            opacity: { duration: 0.3, delay: 0.4 },
            y: { type: "spring", stiffness: 300, damping: 15, delay: 0.4 },
            rotate: {
              duration: 1.1,
              delay: 0.9,
              times: [0, 0.1, 0.35, 0.6, 0.8, 1],
            },
          }}
        >
          <Token className="size-8 opacity-30 grayscale" />
        </m.div>
        <EmptyMascot mood="sad" className="relative w-56" />
      </Band>
    );
  }

  if (variant === "cheer") {
    return (
      <Band glow="brand">
        <Sparkles spots={CHEER_SPARKLES} />
        <MiniConfetti className="top-1/2 left-1/2" spread={170} delay={0.55} />
        <EmptyMascot mood="cheer" className="relative w-60" />
      </Band>
    );
  }

  return (
    <Band glow="brand">
      <EmptyMascot mood="wave" className="relative w-56" />
    </Band>
  );
};

export default DialogHero;
