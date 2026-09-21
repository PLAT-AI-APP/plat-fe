import React from "react";

/**
 * 캐릭터 상세 로딩 자리표시자.
 *
 * 예전에는 720px 짜리 회색 상자 하나여서, 로딩이 끝나면 두 열 레이아웃이 통째로 바뀌며 튀었다.
 * 실제 화면과 같은 그리드(389px 요약 열 + 본문 열)와 같은 두 열 기준(900px)을 써서 뼈대를 맞춘다.
 */
const SkeletonCharacterDetail = () => {
  return (
    <article
      aria-hidden="true"
      className="flex w-full justify-center pb-16 pt-5"
    >
      <div className="grid w-full max-w-(--content-max-width) grid-cols-1 gap-[27px] min-[900px]:grid-cols-[389px_minmax(0,782px)]">
        {/* 요약 열: 대표 이미지 / 제목·소개 / 채팅 시작 버튼 */}
        <div className="flex flex-col gap-5">
          <div className="skeleton aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-2">
            <div className="skeleton h-7 w-2/3 rounded-full" />
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-1/2 rounded-full" />
          </div>
          <div className="skeleton h-12 w-full rounded-2xl" />
        </div>

        {/* 본문 열: 탭 / 시나리오 */}
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="skeleton h-6 w-20 rounded-full" />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="skeleton h-5 w-32 rounded-full" />
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-3/4 rounded-full" />
          </div>
          <div className="skeleton h-40 w-full rounded-2xl" />
        </div>
      </div>
    </article>
  );
};

export default SkeletonCharacterDetail;
