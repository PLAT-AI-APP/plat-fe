import React from "react";
import MyChattingContents from "./_components/MyChattingContents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 채팅",
};

interface MyChattingPageProps {
  params: Promise<{ id: string }>; // 동적 라우팅 폴더명이 [id]인 경우
}
const MyChattingPage = async ({ params }: MyChattingPageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <MyChattingContents id={id} />;
};

export default MyChattingPage;
