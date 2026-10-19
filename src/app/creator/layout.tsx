import React from "react";
import CreatorTabs from "./_components/CreatorTabs";

/** 크리에이터 영역. 수익과 등급을 같은 머리 아래 탭으로 둔다. */
const CreatorLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto mb-10 flex w-full max-w-160 flex-col gap-6 pt-5">
    <CreatorTabs />
    {children}
  </div>
);

export default CreatorLayout;
