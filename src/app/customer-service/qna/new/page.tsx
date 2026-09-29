import React from "react";
import { Metadata } from "next";
import QnaWriteContents from "./_components/QnaWriteContents";

export const metadata: Metadata = {
  title: "1:1 문의하기",
};

/** `?category=BUG` 처럼 유형을 골라 둔 채 열 수 있다(베타 배너·프로필 메뉴의 버그 제보). */
const QnaWritePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) => {
  const { category } = await searchParams;
  return <QnaWriteContents initialCategory={category} />;
};

export default QnaWritePage;
