import { cn } from "@/lib/utils";
import { NOTICE_DUMMY } from "@/mocks/dummyData";
import React from "react";
import FilterTab from "./_components/FilterTab";
import Link from "next/link";
import { Metadata } from "next";
import NoticeList from "./_components/NoticeList";

export const metadata: Metadata = {
  title: "공지사항",
};

interface NotificationPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const NotificationPage = async ({ searchParams }: NotificationPageProps) => {
  // 상태 및 데이터 처리
  const sParams = await searchParams;
  const currentFilter =
    (sParams.filter as "ALL" | "NOTICE" | "UPDATE" | "EVENT") || "ALL";

  return (
    <section className="flex flex-col gap-9 max-w-155 w-full mx-auto">
      <header>
        <h2 className="text-2xl font-medium">공지사항</h2>
      </header>

      <div id="notice-content-area" className="flex flex-col gap-4">
        {/* 전체/공지/업데이트/이벤트 filter tab */}
        <nav>
          <FilterTab currentFilter={currentFilter} />
        </nav>

        <NoticeList />
      </div>
    </section>
  );
};

export default NotificationPage;
