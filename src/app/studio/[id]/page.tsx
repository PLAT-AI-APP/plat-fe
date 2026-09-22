import type { Metadata } from "next";
import React from "react";
import StudioContents from "./_components/StudioContents";

export const metadata: Metadata = {
  title: "Studio",
};

interface Props {
  params: Promise<{ id: string }>;
}

// 보기·정렬은 StudioContents 가 주소에서 직접 읽는다. 여기서 searchParams 를 읽으면 전환할
// 때마다 서버 렌더를 다시 받아, 토글 손잡이가 서버 응답만큼 늦게 움직였다.
const StudioPage = async ({ params }: Props) => {
  const { id } = await params;

  return <StudioContents id={id} />;
};

export default StudioPage;
