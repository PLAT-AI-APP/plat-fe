import type { Metadata } from "next";
import React from "react";
import { parseNoticeCategory } from "@/constants/notice";
import NotificationContents from "./_components/NotificationContents";

export const metadata: Metadata = {
  title: "Notice",
};

interface NotificationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const NotificationPage = async ({ searchParams }: NotificationPageProps) => {
  const sParams = await searchParams;
  // 서버로 보내는 값이라 알 수 없는 filter 는 전체로 본다.
  const currentFilter = parseNoticeCategory(sParams.filter);

  return <NotificationContents currentFilter={currentFilter} />;
};

export default NotificationPage;
