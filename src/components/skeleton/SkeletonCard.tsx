import React from "react";
// import { motion } from "framer-motion";

interface SkeletonProps {
  cardHeight: number;
}

const SkeletonCharacterCard = ({ cardHeight }: SkeletonProps) => {
  return (
    <article
      id="character-skeleton-card"
      style={{ height: `${cardHeight}px` }}
      className="relative overflow-hidden rounded-xl w-43.75 flex flex-col shrink-0"
    >
      {/* 이미지 영역 스켈레톤 (h-45 동일 적용) */}
      <div className="relative w-full h-43.75 shrink-0 bg-card-hover rounded-xl" />

      {/* 텍스트 영역 스켈레톤 (패딩 및 간격 일치) */}
      <section className="px-1 pt-3 flex flex-col gap-2 flex-1">
        {/* 이름 (폰트 크기에 맞춘 높이) */}
        <div className="h-5 w-3/4 rounded-xl bg-card-hover" />

        <div className="h-10 w-full rounded-xl bg-card-hover" />

        <div className="h-5 w-2/6 bg-card-hover rounded-xl"></div>
      </section>

      {/* Shimmer 애니메이션 레이어 */}
      {/* <motion.div
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
      /> */}
    </article>
  );
};

export default SkeletonCharacterCard;
