import type { Metadata } from "next";
import React from "react";
import type { NoticeCategory } from "@/type/notice";
import NotificationContents from "./_components/NotificationContents";

export const metadata: Metadata = {
  title: "Notice",
};

interface NotificationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const NotificationPage = async ({ searchParams }: NotificationPageProps) => {
  const sParams = await searchParams;
  const currentFilter = sParams.filter as NoticeCategory | null | undefined;

  return <NotificationContents currentFilter={currentFilter} />;
};

export default NotificationPage;
