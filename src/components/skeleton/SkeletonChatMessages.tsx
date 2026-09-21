import React from "react";

/**
 * 채팅 이력 로딩 자리표시자.
 *
 * MessageList 와 같은 좌우 여백(px-4)·행 간격(gap-6)을 쓰고, 실제 말풍선의 모양
 * (캐릭터: 36px 아바타 + 이름 + 모서리 하나가 각진 말풍선 / 사용자: 오른쪽 정렬)을 흉내 낸다.
 */
const SkeletonChatMessages = () => {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-6 px-4 pb-6 pt-2"
    >
      {/* 캐릭터 대사 */}
      <div className="flex gap-2">
        <div className="skeleton size-9 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="skeleton h-4 w-20 rounded-full" />
          <div className="skeleton h-[60px] w-[min(360px,80%)] rounded-[0px_16px_16px_16px]" />
        </div>
      </div>

      {/* 사용자 말풍선 */}
      <div className="flex justify-end">
        <div className="skeleton h-10 w-[min(240px,60%)] rounded-[16px_16px_0px_16px]" />
      </div>

      {/* 지문 */}
      <div className="flex gap-5">
        <div className="skeleton size-6 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-2/3 rounded-full" />
        </div>
      </div>

      {/* 캐릭터 대사 */}
      <div className="flex gap-2">
        <div className="skeleton size-9 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="skeleton h-4 w-20 rounded-full" />
          <div className="skeleton h-[84px] w-[min(420px,85%)] rounded-[0px_16px_16px_16px]" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonChatMessages;
