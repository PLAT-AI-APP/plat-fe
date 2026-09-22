import React from "react";

/** 신고 내역 카드 로딩 스켈레톤 */
const SkeletonMyReportItem = () => {
  return (
    <li className="flex w-full flex-col gap-2 overflow-hidden rounded-2xl bg-dark px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-12 rounded-md skeleton" />
        <div className="h-5 w-16 rounded-md skeleton" />
      </div>
      <div className="h-4 w-40 rounded skeleton" />
      <div className="h-3 w-full rounded skeleton" />
      <div className="h-3 w-32 rounded skeleton" />
    </li>
  );
};

export default SkeletonMyReportItem;
