import React from "react";

/**
 * 캐릭터 카드 로딩 자리표시자.
 *
 * 블록 높이는 실제 카드의 글자 높이에 맞춘다 —
 * 제목(title-5, 14px × 1.5 ≈ 21px)과 설명(body-7, 12px × 1.5 = 18px).
 * 자리표시자가 실제 콘텐츠보다 크면 로딩이 끝나는 순간 레이아웃이 튄다.
 */
const SkeletonCharacterCard = () => {
  return (
    <article
      id="character-skeleton-card"
      className="relative flex shrink-0 flex-col overflow-hidden rounded-xl"
    >
      {/* 이미지 영역 */}
      <div className="skeleton relative h-43.75 w-full shrink-0 rounded-xl" />

      <section className="flex flex-1 flex-col gap-2 px-1 pt-3">
        {/* 제목 */}
        <div className="skeleton h-5 w-[70%] rounded-full" />
        {/* 설명 */}
        <div className="skeleton h-4.5 w-full rounded-full" />
        {/* 메타 */}
        <div className="skeleton h-4.5 w-1/3 rounded-full" />
      </section>
    </article>
  );
};

export default SkeletonCharacterCard;
