import React from "react";

/** 사용내역 아이템 로딩 스켈레톤 */
const SkeletonUsageHistoryItem = () => {
  return (
    <li className="w-full overflow-hidden rounded-2xl bg-dark px-5 py-3">
      <header className="flex items-center justify-between gap-4">
        <div className="flex w-[117px] shrink-0 flex-col gap-2">
          <div className="h-3 w-16 rounded skeleton" />
          <div className="h-4 w-24 rounded skeleton" />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="h-4 w-20 rounded skeleton" />
          <div className="h-3 w-28 rounded skeleton" />
        </div>
      </header>
    </li>
  );
};

export default SkeletonUsageHistoryItem;
