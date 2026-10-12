"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState, type ButtonHTMLAttributes } from "react";
import { EASE_OUT } from "@/constants/motion";
import { cn } from "@/lib/utils";
import { CONFETTI_COLORS } from "./MiniConfetti";
import RollText from "./RollText";

/** 버튼 둘레로 튀는 빛 알갱이 — 위·옆으로만, 아래(목록 쪽)로는 거의 안 간다 */
const sparks = (scale: number) =>
  Array.from({ length: 12 }, (_, index) => {
    const angle = ((-200 + (index / 11) * 220) * Math.PI) / 180;
    const distance = (46 + (index % 3) * 12) * scale;
    return {
      x: Math.cos(angle) * distance * 1.25,
      y: Math.sin(angle) * distance * 0.8,
      size: index % 3 === 0 ? 5 : 3.5,
      color: CONFETTI_COLORS[index % 3],
      delay: (index % 4) * 0.025,
    };
  });
const SPARKS = sparks(1);
const SPARKS_SMALL = sparks(0.6);

/** 팔로우 상태가 바뀐 횟수. 처음 그릴 때는 0 이라 움직이지 않는다. */
export const useFollowPulse = (isFollowing: boolean) => {
  const [previous, setPrevious] = useState(isFollowing);
  const [pulse, setPulse] = useState(0);
  if (previous !== isFollowing) {
    setPrevious(isFollowing);
    setPulse((count) => count + 1);
  }
  return pulse;
};

interface FollowButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "children"
  | "onAnimationStart"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "style"
> {
  isFollowing: boolean;
  /** 지금 버튼에 보일 글자(호출부의 규칙대로: 동작 이름이든 상태 이름이든) */
  label: string;
  /** 작은 알약 버튼(카드·목록)이면 체크·알갱이를 줄인다 */
  small?: boolean;
}

/**
 * 팔로우 버튼.
 * 팔로우: 버튼 안에서 주황 물결이 차올랐다 빠지고, 체크가 그려지며 글자가 굴러 바뀐다. 둘레로 빛 알갱이가 튄다.
 * 언팔로우: 체크가 거꾸로 지워지고 글자가 내려가며 차분하게 식는다.
 * 색·크기는 호출부 className 이 정한다(기존 버튼 모양 그대로).
 */
const FollowButton = ({
  isFollowing,
  label,
  small = false,
  className,
  ...buttonProps
}: FollowButtonProps) => {
  const pulse = useFollowPulse(isFollowing);
  const justFollowed = isFollowing && pulse > 0;
  const justUnfollowed = !isFollowing && pulse > 0;
  const checkSize = small ? 12 : 18;

  return (
    <span className="relative inline-flex shrink-0">
      {justFollowed && (
        <span
          key={pulse}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-10"
        >
          {(small ? SPARKS_SMALL : SPARKS).map((spark, index) => (
            <m.span
              key={index}
              className="absolute rounded-full"
              style={{
                width: spark.size,
                height: spark.size,
                marginLeft: -spark.size / 2,
                marginTop: -spark.size / 2,
                backgroundColor: spark.color,
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              animate={{
                x: spark.x,
                y: spark.y,
                opacity: [0, 1, 0],
                scale: [0.4, 1.1, 0.6],
              }}
              transition={{
                delay: 0.12 + spark.delay,
                duration: 0.6,
                ease: EASE_OUT,
              }}
            />
          ))}
        </span>
      )}

      <m.button
        type="button"
        {...buttonProps}
        whileTap={{ scale: 0.92 }}
        animate={
          justFollowed
            ? { scale: [0.92, 1.08, 0.98, 1] }
            : justUnfollowed
              ? { scale: [0.94, 1.01, 1] }
              : { scale: 1 }
        }
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className={cn(
          "relative isolate flex items-center justify-center gap-1 overflow-hidden transition-colors duration-500",
          className,
        )}
      >
        {/* 팔로우: 주황 물결이 가운데서 차올랐다가 빠지며 원래 색으로 가라앉는다 */}
        {justFollowed && (
          <m.span
            key={`ripple-${pulse}`}
            aria-hidden
            className="absolute top-1/2 left-1/2 -z-10 -mt-20 -ml-20 size-40 rounded-full bg-brand"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.1, 1.1], opacity: [1, 1, 0] }}
            transition={{ duration: 0.85, times: [0, 0.4, 1], ease: EASE_OUT }}
          />
        )}
        {/* 버튼 위를 한 번 지나가는 광택 */}
        {justFollowed && (
          <m.span
            key={`shine-${pulse}`}
            aria-hidden
            className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ x: "0%" }}
            animate={{ x: "350%" }}
            transition={{ delay: 0.35, duration: 0.6, ease: "easeInOut" }}
          />
        )}

        {/* 체크 — 팔로우하면 그려지고, 언팔로우하면 거꾸로 지워지며 접힌다. 처음부터 팔로우 중이면 그리지 않는다. */}
        <AnimatePresence initial={false}>
          {isFollowing && pulse > 0 && (
            <m.svg
              key="check"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="shrink-0"
              initial={{ width: 0, opacity: 0, rotate: -30 }}
              animate={{ width: checkSize, opacity: 1, rotate: 0 }}
              exit={{ width: 0, opacity: 0, rotate: 20 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              style={{ height: checkSize }}
            >
              <m.path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{ delay: 0.18, duration: 0.3, ease: "easeOut" }}
              />
            </m.svg>
          )}
        </AnimatePresence>
        <RollText value={label} up={isFollowing} />
      </m.button>
    </span>
  );
};

export default FollowButton;
