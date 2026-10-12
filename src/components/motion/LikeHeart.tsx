"use client";

import { m } from "framer-motion";
import { useState } from "react";
import { EASE_OUT } from "@/constants/motion";
import { Heart, HeartFill } from "@/icons";
import { cn } from "@/lib/utils";

interface LikeHeartProps {
  liked: boolean;
  /** 댓글처럼 작은 자리. 하트와 퍼지는 점을 줄인다. */
  small?: boolean;
  className?: string;
}

const burst = (radius: number) =>
  Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      big: index % 2 === 0,
    };
  });
const BURST = burst(30);
const BURST_SMALL = burst(18);

/**
 * 찜·좋아요 하트. 누르면 움츠렸다 튀고 둥근 파동과 작은 점들이 퍼진다. 취소는 살짝 줄었다 돌아온다.
 * 처음 그릴 때는 움직이지 않고, liked 가 바뀔 때만 한 번 움직인다(낙관적 갱신이 되돌아갈 때 포함).
 */
const LikeHeart = ({ liked, small = false, className }: LikeHeartProps) => {
  const [previousLiked, setPreviousLiked] = useState(liked);
  const [pulse, setPulse] = useState(0);
  if (previousLiked !== liked) {
    setPreviousLiked(liked);
    setPulse((count) => count + 1);
  }

  const dots = small ? BURST_SMALL : BURST;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      {liked && pulse > 0 && (
        <span
          key={pulse}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <m.span
            className={cn(
              "absolute rounded-full border-brand",
              small ? "size-5 border" : "size-8 border-2",
            )}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
          {dots.map((dot, index) => (
            <m.span
              key={index}
              className={cn(
                "absolute rounded-full",
                dot.big ? "bg-brand" : "bg-[#ffd27a]",
                small ? "size-1" : dot.big ? "size-1.5" : "size-1",
              )}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: dot.x, y: dot.y, opacity: 0, scale: 0.4 }}
              transition={{ delay: 0.08, duration: 0.5, ease: EASE_OUT }}
            />
          ))}
        </span>
      )}
      <m.span
        className="relative inline-flex"
        animate={
          pulse === 0
            ? { scale: 1 }
            : liked
              ? { scale: [1, 0.6, 1.3, 1] }
              : { scale: [1, 0.8, 1] }
        }
        transition={{ duration: liked ? 0.45 : 0.25, ease: EASE_OUT }}
      >
        {liked ? (
          <HeartFill
            className={cn(small ? "size-4" : "size-5", "text-brand")}
            aria-hidden="true"
          />
        ) : (
          <Heart className={small ? "size-4" : "size-5"} aria-hidden="true" />
        )}
      </m.span>
    </span>
  );
};

export default LikeHeart;
