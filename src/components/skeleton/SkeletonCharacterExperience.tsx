import React from "react";

// md 미만: 이미지 위 / 채팅 미리보기 아래로 쌓인다. md 이상: 좌우 배치.
// 실제 콘텐츠(CharacterProfileCard/ChatPreview)와 같은 폭·높이·브레이크포인트를
// 써야 로딩이 끝나는 순간 레이아웃이 튀지 않는다.
const SkeletonCharacterExperience = () => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl md:h-95 md:flex-row">
      {/* 프로필 이미지 영역 */}
      <div className="skeleton aspect-square w-full max-h-95 shrink-0 md:aspect-auto md:h-full md:w-95 md:min-w-86.75 md:shrink" />

      {/* 채팅 미리보기 영역: ChatPreview와 같은 p-9/justify-start 정렬 +
          하단 CTA 자리(ActionFooter)까지 흉내내 로딩 종료 시 튀지 않게 한다. */}
      <div className="relative flex h-95 w-full shrink-0 flex-col gap-6 overflow-hidden bg-darkest p-9 md:h-full md:flex-1 md:shrink">
        <div className="flex w-full items-start gap-2">
          <div className="skeleton size-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="skeleton h-3.5 w-20 rounded-full" />
            <div className="skeleton h-8 w-3/4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl" />
          </div>
        </div>

        <div className="flex w-full items-start gap-5">
          <div className="skeleton size-7 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div className="skeleton h-3.5 w-full rounded-full" />
            <div className="skeleton h-3.5 w-full rounded-full" />
            <div className="skeleton h-3.5 w-2/3 rounded-full" />
          </div>
        </div>

        {/* ActionFooter는 p-9 안이 아니라 패널 가장자리에 딱 붙는 별도 레이어라 inset-0 기준으로 맞춘다. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-9 pb-9">
          <div className="skeleton h-4 w-2/3 rounded-full" />
          <div className="skeleton h-11 w-full rounded-br-2xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCharacterExperience;
