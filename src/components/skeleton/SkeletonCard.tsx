import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  cardHeight: number;
}

const SkeletonCharacterCard = ({ cardHeight }: SkeletonProps) => {
  return (
    <article
      id="character-skeleton-card"
      style={{ height: `${cardHeight}px` }}
      className="relative overflow-hidden bg-card rounded-xl w-44.5 flex flex-col shrink-0"
    >
      {/* 이미지 영역 스켈레톤 (h-45 동일 적용) */}
      <div className="relative w-full h-45 shrink-0 bg-card-hover" />

      {/* 텍스트 영역 스켈레톤 (패딩 및 간격 일치) */}
      <section className="p-3 pt-2 flex flex-col gap-2 flex-1">
        {/* 이름 (폰트 크기에 맞춘 높이) */}
        <div className="h-4 w-3/4 rounded bg-card-hover" />

        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-card-hover" />
          <div className="h-3 w-5/6 rounded bg-card-hover" />
        </div>

        {/* 태그 리스트 영역 (TagList 위치) */}
        <footer className="flex gap-1.5 mt-auto">
          <div className="h-5 w-10 rounded-full bg-card-hover" />
          <div className="h-5 w-12 rounded-full bg-card-hover" />
          <div className="h-5 w-8 rounded-full bg-card-hover" />
        </footer>
      </section>

      {/* Shimmer 애니메이션 레이어 */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ translateX: "-100%" }}
        animate={{ translateX: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        }}
      />
    </article>
  );
};

export default SkeletonCharacterCard;
