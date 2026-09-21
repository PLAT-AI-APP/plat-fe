import React from "react";

/**
 * 세계관 수정 화면의 로딩 자리표시자.
 *
 * 수정 화면은 상세를 받아 reset() 하기 전까지 폼이 비어 있어, 그대로 그리면 빈 입력칸이 보이다가
 * 값이 한꺼번에 채워지며 튄다. CharacterCreateForm 의 본문 영역(탭 + 폼 / lg 이상에서 미리보기)과
 * 같은 폭·그리드를 써서 자리만 잡아 둔다.
 */
const SkeletonCharacterCreate = () => {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-0 min-w-0 flex-1 items-start justify-center gap-4 lg:grid lg:grid-cols-[491fr_693fr]"
    >
      <section className="flex w-full max-w-[491px] min-w-0 flex-col gap-9">
        {/* 탭 */}
        <div className="flex h-10 gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="skeleton h-6 w-[83px] self-center rounded-full" />
          ))}
        </div>

        {/* 대표 이미지 + 입력칸 */}
        <div className="flex flex-col gap-6">
          <div className="skeleton h-[157px] w-[120px] rounded-xl" />
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="skeleton h-5 w-24 rounded-full" />
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </section>

      <div className="hidden lg:block">
        <div className="skeleton h-[480px] w-full rounded-2xl" />
      </div>
    </div>
  );
};

export default SkeletonCharacterCreate;
