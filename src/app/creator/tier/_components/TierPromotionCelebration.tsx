"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import type { Tier } from "./tiers";

interface TierPromotionCelebrationProps {
  /** 승급 전 등급. 등급 없음에서 오르면 null */
  from: Tier | null;
  to: Tier;
  /** 이번에 지급한 축하 노트. 없으면 줄을 숨긴다. */
  giftNotes: number;
  /** 등급이 없을 때 수익률(%). 등급 없음에서 오를 때 이전 값으로 쓴다. */
  baseRate: number;
  /** 사다리 위치(0 = 더스트). 등급이 높을수록 연출이 커진다. 오리진은 따로 쓴다. */
  ladderIndex: number;
  onClose: () => void;
}

/*
 * 승급 연출. 결제 완료·로그인 성공 화면처럼 한 번의 큰 순간을 만든다.
 *  1. 모으기: 이전 뱃지 주위로 빛이 빨려 들어가며 떨린다.
 *  2. 터지기: 섬광, 충격파, 입자 폭발.
 *  3. 드러내기: 새 뱃지가 돌며 착지, 뒤로 빛줄기가 돈다. 이름·수익률·축하 노트가 차례로 올라온다.
 * 등급이 높을수록 모으는 시간, 입자 수, 충격파, 섬광, 회전이 커지고
 * 노바부터 화면 흔들림·2차 폭죽, 갤럭시는 궤도 빛·색종이 비·빛나는 이름이 더해진다.
 * 오리진은 사다리 밖의 공식 제작자라 따로 한 단계 더: 홀로그램 다색 입자·빛줄기·이름, 폭죽 세 번.
 * 움직임 줄이기 설정이면 결과 화면만 보여 준다.
 */
interface Fx {
  chargeMs: number;
  /** 폭발 입자 수 */
  burst: number;
  /** 폭발 입자 중 별 모양 비율 */
  starRatio: number;
  /** 충격파 겹 수 */
  waves: number;
  /** 섬광 세기 0~1 */
  flash: number;
  /** 빛줄기 세기 0~1, 0 이면 없음 */
  rays: number;
  /** 새 뱃지가 착지하며 도는 각도 */
  spin: number;
  /** 착지 후 떠다니는 입자 빈도 */
  ambient: number;
  shake: boolean;
  secondBurst: boolean;
  orbit: boolean;
  rain: boolean;
  glowName: boolean;
  /** 오리진 전용 홀로그램 다색 */
  holo: boolean;
}

const FX: Fx[] = [
  {
    chargeMs: 850,
    burst: 45,
    starRatio: 0.1,
    waves: 1,
    flash: 0.3,
    rays: 0,
    spin: 0,
    ambient: 0.06,
    shake: false,
    secondBurst: false,
    orbit: false,
    rain: false,
    glowName: false,
    holo: false,
  },
  {
    chargeMs: 950,
    burst: 75,
    starRatio: 0.2,
    waves: 1,
    flash: 0.5,
    rays: 0.16,
    spin: 180,
    ambient: 0.12,
    shake: false,
    secondBurst: false,
    orbit: false,
    rain: false,
    glowName: false,
    holo: false,
  },
  {
    chargeMs: 1100,
    burst: 120,
    starRatio: 0.35,
    waves: 2,
    flash: 0.75,
    rays: 0.3,
    spin: 360,
    ambient: 0.2,
    shake: false,
    secondBurst: false,
    orbit: false,
    rain: false,
    glowName: false,
    holo: false,
  },
  {
    chargeMs: 1250,
    burst: 170,
    starRatio: 0.45,
    waves: 2,
    flash: 0.85,
    rays: 0.4,
    spin: 540,
    ambient: 0.3,
    shake: true,
    secondBurst: true,
    orbit: false,
    rain: false,
    glowName: true,
    holo: false,
  },
  {
    chargeMs: 1450,
    burst: 230,
    starRatio: 0.5,
    waves: 3,
    flash: 0.95,
    rays: 0.5,
    spin: 720,
    ambient: 0.45,
    shake: true,
    secondBurst: true,
    orbit: true,
    rain: true,
    glowName: true,
    holo: false,
  },
];

const ORIGIN_FX: Fx = {
  chargeMs: 1800,
  burst: 300,
  starRatio: 0.6,
  waves: 3,
  flash: 1,
  rays: 0.5,
  spin: 1080,
  ambient: 0.6,
  shake: true,
  secondBurst: true,
  orbit: true,
  rain: true,
  glowName: true,
  holo: true,
};

/** 오리진 홀로그램 색 */
const HOLO = ["#FFB86B", "#FF7AC6", "#8F7BFF", "#4FD9E8", "#9BF5B4"];

type Phase = "charge" | "reveal";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  kind: "dot" | "star" | "confetti";
  spin: number;
  inward?: boolean;
}

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

/** 화면 전체 입자. 중심은 매 프레임 뱃지 자리에서 읽어, 뱃지와 입자가 어긋나지 않게 한다. */
const useParticles = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  centerRef: React.RefObject<HTMLDivElement | null>,
  color: string,
  fx: Fx,
  enabled: boolean,
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rgb = hexToRgb(color);
    const palette = fx.holo
      ? [...HOLO, "#ffffff"]
      : [`rgb(${rgb})`, "#ffffff", `rgba(${rgb},0.7)`, "#FFE9C7"];
    const pick = () => palette[Math.floor(Math.random() * palette.length)];
    const particles: Particle[] = [];
    const center = () => {
      const rect = centerRef.current?.getBoundingClientRect();
      return rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    };
    const start = performance.now();
    let burst = false;
    let second = false;
    let third = false;
    let raf = 0;

    const spawnInward = () => {
      const c = center();
      const angle = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 140;
      particles.push({
        x: c.x + Math.cos(angle) * dist,
        y: c.y + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        life: 0,
        max: 45,
        size: 1 + Math.random() * 1.8,
        color: Math.random() < 0.5 ? palette[0] : "#ffffff",
        kind: "dot",
        spin: 0,
        inward: true,
      });
    };

    const spawnBurst = (x: number, y: number, count: number, ring = false) => {
      for (let i = 0; i < count; i += 1) {
        const angle = ring
          ? (i / count) * Math.PI * 2
          : Math.random() * Math.PI * 2;
        const speed = ring ? 6 + Math.random() * 1.5 : 3 + Math.random() * 9;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (ring ? 0 : 1.5),
          life: 0,
          max: 70 + Math.random() * 60,
          size: 1.5 + Math.random() * 3.5,
          color: pick(),
          kind: Math.random() < fx.starRatio ? "star" : "dot",
          spin: Math.random() * Math.PI,
        });
      }
    };

    const spawnAmbient = () => {
      const c = center();
      particles.push({
        x: c.x + (Math.random() - 0.5) * 360,
        y: c.y + 140 + Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.4 - Math.random() * 0.7,
        life: 0,
        max: 170,
        size: 1 + Math.random() * 2,
        color: pick(),
        kind: Math.random() < 0.3 ? "star" : "dot",
        spin: 0,
      });
    };

    const spawnConfetti = () => {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 1.5 + Math.random() * 2,
        life: 0,
        max: 260,
        size: 3 + Math.random() * 3,
        color: fx.holo
          ? pick()
          : [palette[0], "#ffffff", "#FFD27A", "#FF9AC8"][
              Math.floor(Math.random() * 4)
            ],
        kind: "confetti",
        spin: Math.random() * Math.PI,
      });
    };

    const drawStar = (x: number, y: number, r: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i += 1) {
        const a = (i * Math.PI) / 2;
        ctx.quadraticCurveTo(
          0,
          0,
          Math.cos(a) * r * 2.4,
          Math.sin(a) * r * 2.4,
        );
        ctx.quadraticCurveTo(
          0,
          0,
          Math.cos(a + Math.PI / 4) * r * 0.5,
          Math.sin(a + Math.PI / 4) * r * 0.5,
        );
      }
      ctx.fill();
      ctx.restore();
    };

    const tick = (now: number) => {
      const t = now - start;
      const c = center();
      if (t < fx.chargeMs - 100) {
        const rate = 1 + fx.burst / 80;
        for (let i = 0; i < rate; i += 1) spawnInward();
      } else if (!burst && t >= fx.chargeMs) {
        burst = true;
        spawnBurst(c.x, c.y, fx.burst);
      } else if (burst) {
        if (fx.secondBurst && !second && t >= fx.chargeMs + 320) {
          second = true;
          spawnBurst(c.x, c.y, 48, true);
          spawnBurst(c.x - 150, c.y - 40, 36);
          spawnBurst(c.x + 150, c.y - 40, 36);
        }
        if (fx.holo && !third && t >= fx.chargeMs + 750) {
          third = true;
          spawnBurst(c.x - 110, c.y - 120, 50);
          spawnBurst(c.x + 110, c.y - 120, 50);
          spawnBurst(c.x, c.y, 64, true);
        }
        if (Math.random() < fx.ambient) spawnAmbient();
        if (fx.rain) {
          const rain =
            t < fx.chargeMs + 2600 ? 2 : Math.random() < 0.35 ? 1 : 0;
          for (let i = 0; i < rain; i += 1) spawnConfetti();
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life += 1;
        if (p.inward) {
          p.x += (c.x - p.x) * 0.09;
          p.y += (c.y - p.y) * 0.09;
          if (Math.hypot(c.x - p.x, c.y - p.y) < 6) p.life = p.max;
        } else if (p.kind === "confetti") {
          p.x += p.vx + Math.sin((p.life + p.spin * 30) / 18) * 0.6;
          p.y += p.vy;
          p.spin += 0.1;
        } else {
          p.vx *= 0.96;
          p.vy = p.vy * 0.96 + 0.06;
          p.x += p.vx;
          p.y += p.vy;
          p.spin += 0.08;
        }
        const alpha = Math.max(0, 1 - p.life / p.max);
        if (alpha <= 0 || p.y > window.innerHeight + 20) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha =
          p.kind === "confetti" ? Math.min(1, alpha * 1.6) : alpha;
        ctx.fillStyle = p.color;
        ctx.globalCompositeOperation =
          p.kind === "confetti" ? "source-over" : "lighter";
        if (p.kind === "star") {
          drawStar(p.x, p.y, p.size, p.spin);
        } else if (p.kind === "confetti") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin);
          ctx.scale(1, Math.abs(Math.cos(p.spin * 1.3)) + 0.2);
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, centerRef, color, fx, enabled]);
};

/** run 이 켜지면 숫자가 올라가며 채워진다. */
const CountUp = ({
  from,
  to,
  delay,
  run,
}: {
  from: number;
  to: number;
  delay: number;
  run: boolean;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!run) return;
    const controls = animate(from, to, {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [from, to, delay, run]);
  return <span ref={ref}>{from.toLocaleString()}</span>;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** 글은 처음부터 자리를 잡아 두고(뱃지가 움직이지 않게) 드러낼 때만 올라온다. */
const rise = (delay: number, show: boolean) => ({
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: show
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : { opacity: 0, y: 14, filter: "blur(6px)" },
  transition: { duration: 0.6, delay: show ? delay : 0, ease: EASE },
});

const TierPromotionCelebration = ({
  from,
  to,
  giftNotes,
  baseRate,
  ladderIndex,
  onClose,
}: TierPromotionCelebrationProps) => {
  const t = useTranslations("earnings.tier");
  const reduce = useReducedMotion() ?? false;
  const fx = to.official
    ? ORIGIN_FX
    : FX[Math.min(Math.max(0, ladderIndex), FX.length - 1)];
  const [phase, setPhase] = useState<Phase>(reduce ? "reveal" : "charge");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  useParticles(canvasRef, badgeRef, to.color, fx, !reduce);

  useEffect(() => {
    if (reduce) return;
    const timer = setTimeout(() => setPhase("reveal"), fx.chargeMs);
    return () => clearTimeout(timer);
  }, [reduce, fx.chargeMs]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && phase === "reveal") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onClose]);

  const show = phase === "reveal";
  const base = reduce ? 0 : 0.25;
  const glow = `rgba(${hexToRgb(to.color)},`;
  const chargeSec = fx.chargeMs / 1000;
  const jitter = 1 + fx.burst / 70;

  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label={t("celebrationAria", { name: to.name })}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-scrim/85 text-overlay-font backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 등급 색 바닥 빛 */}
      <m.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: fx.holo
            ? "radial-gradient(40% 35% at 35% 35%, rgba(255,122,198,.22), transparent 70%), radial-gradient(40% 35% at 65% 35%, rgba(79,217,232,.2), transparent 70%), radial-gradient(55% 45% at 50% 45%, rgba(143,123,255,.3), transparent 70%)"
            : `radial-gradient(60% 50% at 50% 40%, ${glow}${0.12 + fx.rays * 0.3}), transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 size-full"
      />

      {/* 섬광 */}
      {!reduce && show && (
        <m.div
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: fx.flash }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 + fx.flash * 0.3, ease: "easeOut" }}
        />
      )}

      <m.div
        className="relative flex w-full max-w-90 flex-col items-center px-6 text-center"
        animate={
          !reduce && show && fx.shake
            ? { x: [0, -7, 7, -5, 5, -2, 0], y: [0, 4, -4, 3, -2, 0, 0] }
            : undefined
        }
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div
          ref={badgeRef}
          className="relative flex size-44 items-center justify-center"
        >
          {/* 충격파 */}
          {!reduce &&
            show &&
            Array.from({ length: fx.waves }, (_, i) => (
              <m.span
                key={i}
                className="absolute size-28 rounded-full border-2"
                style={{
                  borderColor: fx.holo
                    ? HOLO[(i * 2) % HOLO.length]
                    : i === 2
                      ? "rgba(255,255,255,.7)"
                      : `${glow}0.8)`,
                }}
                initial={{ scale: 0.4, opacity: 1 }}
                animate={{ scale: 3.2 + i * 0.6, opacity: 0 }}
                transition={{
                  duration: 0.9 + i * 0.15,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}

          {/* 빛줄기 */}
          {fx.rays > 0 && (
            <m.div
              className="pointer-events-none absolute size-[300px]"
              style={{
                background: fx.holo
                  ? "repeating-conic-gradient(from 0deg, rgba(255,184,107,.5) 0deg 5deg, transparent 5deg 15deg, rgba(255,122,198,.5) 15deg 20deg, transparent 20deg 30deg, rgba(143,123,255,.55) 30deg 35deg, transparent 35deg 45deg, rgba(79,217,232,.5) 45deg 50deg, transparent 50deg 60deg)"
                  : `repeating-conic-gradient(from 0deg, ${glow}${fx.rays}) 0deg 6deg, transparent 6deg ${fx.rays >= 0.4 ? 18 : 24}deg)`,
                maskImage: "radial-gradient(circle, #000 18%, transparent 68%)",
                WebkitMaskImage:
                  "radial-gradient(circle, #000 18%, transparent 68%)",
              }}
              initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
              animate={
                show ? { opacity: 1, rotate: 360, scale: 1 } : { opacity: 0 }
              }
              transition={{
                opacity: { duration: 0.8, delay: base },
                scale: { duration: 0.8, delay: base },
                rotate: { duration: 24, repeat: Infinity, ease: "linear" },
              }}
            />
          )}

          {/* 갤럭시: 색이 도는 후광 고리와 궤도 빛 */}
          {fx.orbit && show && (
            <>
              <m.span
                className="pointer-events-none absolute size-[200px] rounded-full"
                style={{
                  background: fx.holo
                    ? `conic-gradient(from 0deg, ${HOLO.join(", ")}, ${HOLO[0]})`
                    : `conic-gradient(from 0deg, ${to.color}, #FFD27A, #ffffff, #FF9AC8, ${to.color})`,
                  maskImage:
                    "radial-gradient(circle, transparent 64%, #000 66%, #000 68%, transparent 70%)",
                  WebkitMaskImage:
                    "radial-gradient(circle, transparent 64%, #000 66%, #000 68%, transparent 70%)",
                }}
                initial={{ opacity: 0, rotate: 0, scale: 0.7 }}
                animate={{ opacity: 0.9, rotate: -360, scale: 1 }}
                transition={{
                  opacity: { duration: 0.6, delay: base + 0.2 },
                  scale: { duration: 0.8, delay: base + 0.2, ease: EASE },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                }}
              />
              <m.div
                className="pointer-events-none absolute size-[200px]"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.6, delay: base + 0.4 },
                  rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                }}
              >
                {[0, 120, 240].map((deg) => (
                  <span
                    key={deg}
                    className="absolute left-1/2 top-1/2 -ml-1 -mt-1 size-2 rounded-full bg-white"
                    style={{
                      transform: `rotate(${deg}deg) translateY(-100px)`,
                      boxShadow: `0 0 10px 3px ${fx.holo ? HOLO[deg / 120 + 1] : to.color}, 0 0 4px #fff`,
                    }}
                  />
                ))}
              </m.div>
            </>
          )}

          <AnimatePresence mode="popLayout">
            {!show ? (
              <m.div
                key="from"
                className="relative flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1, 1.04, 0.96, 1.08],
                  opacity: 1,
                  x: [
                    0,
                    0,
                    -jitter,
                    jitter,
                    -jitter * 1.4,
                    jitter * 1.4,
                    -jitter * 1.8,
                    jitter * 1.8,
                    0,
                  ],
                }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: chargeSec, ease: "easeIn" }}
              >
                {/* 모이는 고리 */}
                <m.span
                  className="absolute size-40 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, ${glow}0.9), transparent 40%)`,
                    maskImage:
                      "radial-gradient(circle, transparent 62%, #000 64%, #000 70%, transparent 72%)",
                    WebkitMaskImage:
                      "radial-gradient(circle, transparent 62%, #000 64%, #000 70%, transparent 72%)",
                  }}
                  initial={{ rotate: 0, scale: 1.5, opacity: 0 }}
                  animate={{ rotate: 360 + fx.spin, scale: 0.75, opacity: 1 }}
                  transition={{ duration: chargeSec, ease: "easeIn" }}
                />
                {from ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={from.badge ?? undefined}
                    alt=""
                    width={96}
                    height={96}
                  />
                ) : (
                  <span className="size-16 rounded-full bg-white/10" />
                )}
              </m.div>
            ) : (
              <m.div
                key="to"
                className="relative"
                style={{ perspective: 600 }}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { scale: 0.2, rotateY: fx.spin, opacity: 0 }
                }
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                transition={
                  reduce
                    ? { duration: 0.4 }
                    : {
                        type: "spring",
                        stiffness: 140,
                        damping: 13 - fx.waves,
                        mass: 0.9,
                      }
                }
              >
                <m.div
                  animate={reduce ? undefined : { y: [0, -6, 0] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={to.badge ?? undefined}
                    alt=""
                    width={132}
                    height={132}
                    style={{
                      filter: `drop-shadow(0 0 ${16 + fx.rays * 40}px ${glow}0.75))`,
                    }}
                  />
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="mt-6 flex w-full flex-col items-center gap-5"
          aria-hidden={!show}
        >
          <div className="flex flex-col items-center gap-1.5">
            <m.span
              className="body-6 tracking-[0.3em] text-overlay-font/60"
              {...rise(base + 0.2, show)}
            >
              {to.official ? t("officialTitle") : t("promoted")}
            </m.span>
            <m.h2
              className="flex text-[44px] font-extrabold leading-tight tracking-tight"
              aria-label={to.name}
              animate={
                show && fx.glowName && !reduce
                  ? {
                      textShadow: fx.orbit
                        ? [
                            `0 0 0px ${glow}0)`,
                            `0 0 28px ${glow}0.9)`,
                            `0 0 12px ${glow}0.5)`,
                            `0 0 28px ${glow}0.9)`,
                          ]
                        : [`0 0 0px ${glow}0)`, `0 0 22px ${glow}0.7)`],
                    }
                  : undefined
              }
              transition={{
                duration: fx.orbit ? 3 : 1,
                delay: base + 0.6,
                repeat: fx.orbit ? Infinity : 0,
                repeatType: "mirror",
              }}
            >
              {[...to.name].map((char, i) => (
                <m.span
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={
                    show
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 18, filter: "blur(8px)" }
                  }
                  transition={{
                    duration: 0.5,
                    delay: show ? base + 0.3 + i * 0.07 : 0,
                    ease: EASE,
                  }}
                  style={
                    fx.holo
                      ? {
                          backgroundImage: `linear-gradient(100deg, ${HOLO.join(", ")}, ${HOLO[0]})`,
                          backgroundSize: `${to.name.length * 100}% 100%`,
                          backgroundPosition: `${(i / Math.max(to.name.length - 1, 1)) * 100}% 0`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }
                      : undefined
                  }
                >
                  {char}
                </m.span>
              ))}
            </m.h2>
          </div>

          <m.div
            className="w-full rounded-2xl p-px"
            style={{
              background: fx.holo
                ? `linear-gradient(120deg, ${HOLO.join(", ")})`
                : "rgba(255,255,255,.1)",
            }}
            {...rise(base + 0.6, show)}
          >
            <div className="flex w-full flex-col gap-2 rounded-[15px] bg-[#121119]/90 p-4 backdrop-blur">
              {to.official ? (
                <>
                  {[
                    [t("rate"), `${to.rate}%`],
                    [t("benefits"), t("benefitsValue")],
                    [t("originBadge"), t("originBadgeValue")],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="body-5 flex items-center justify-between"
                    >
                      <span className="text-overlay-font/60">{label}</span>
                      <span className="title-4">{value}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="body-5 flex items-center justify-between">
                    <span className="text-overlay-font/60">{t("rate")}</span>
                    <span className="title-4 flex items-center gap-2 tabular-nums">
                      <span className="text-overlay-font/60 line-through decoration-white/30">
                        {from?.rate ?? baseRate}%
                      </span>
                      <span className="text-overlay-font/60">→</span>
                      <span>
                        <CountUp
                          from={from?.rate ?? baseRate}
                          to={to.rate}
                          delay={base + 0.8}
                          run={show}
                        />
                        %
                      </span>
                    </span>
                  </div>
                  <div className="body-5 flex items-center justify-between">
                    <span className="text-overlay-font/60">{t("boost")}</span>
                    <span className="title-4 tabular-nums">+{to.boost}%</span>
                  </div>
                  {giftNotes > 0 && (
                    <div className="body-5 flex items-center justify-between border-t border-white/10 pt-2">
                      <span className="text-overlay-font/60">
                        {t("giftLabel")}
                      </span>
                      <span className="title-4 tabular-nums text-brand">
                        +
                        <CountUp
                          from={0}
                          to={giftNotes}
                          delay={base + 0.9}
                          run={show}
                        />
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </m.div>

          <m.div className="w-full" {...rise(base + 1, show)}>
            <Button
              size="lg"
              fullWidth
              onClick={onClose}
              disabled={!show}
              tabIndex={show ? 0 : -1}
            >
              {t("confirm")}
            </Button>
          </m.div>
        </div>
      </m.div>
    </m.div>,
    document.body,
  );
};

export default TierPromotionCelebration;
