import React, { Suspense } from "react";
import { Metadata } from "next";
import MyReportsContents from "./_components/MyReportsContents";

export const metadata: Metadata = {
  title: "신고 내역",
};

/** ?reportId= 를 읽는 클라이언트 컴포넌트라 정적 렌더가 멈추지 않도록 Suspense 로 감싼다. */
const MyReportsPage = () => {
  return (
    <Suspense>
      <MyReportsContents />
    </Suspense>
  );
};

export default MyReportsPage;
