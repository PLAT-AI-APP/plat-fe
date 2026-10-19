import React from "react";
import { Metadata } from "next";
import QnaWriteContents from "./_components/QnaWriteContents";

export const metadata: Metadata = {
  title: "1:1 문의하기",
};

/**
 * `?category=BUG` 처럼 유형을 골라 둔 채 열 수 있다(베타 배너·프로필 메뉴의 버그 제보).
 * 크리에이터 센터 전환 내역은 `?category=EARNING&redemption={교환 번호}` 로 그 교환 건을 붙여 연다.
 */
const QnaWritePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; redemption?: string }>;
}) => {
  const { category, redemption } = await searchParams;
  return <QnaWriteContents initialCategory={category} redemptionNo={redemption} />;
};

export default QnaWritePage;
