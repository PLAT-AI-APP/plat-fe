import { ArrowRight, Clock } from "@/icons";
import { cn } from "@/lib/utils";
import { NOTICE_DUMMY } from "@/mocks/dummyData";
import dayjs from "@/lib/dayjs";
import React from "react";
import FilterTab from "./_components/FilterTab";
import Link from "next/link";

const NotificationColorConfig: Record<string, { bg: string; color: string }> = {
  공지: {
    bg: "bg-[#0088FF26]",
    color: "text-[#0088FF]",
  },
  업데이트: {
    bg: "bg-[#34C75926]",
    color: "text-[#34C759]",
  },
  이벤트: {
    bg: "bg-[#FFCC0026]",
    color: "text-[#FFCC00]",
  },
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

        <ul>
          {NOTICE_DUMMY.map(
            ({ category, categoryName, createdAt, id, title }) => {
              // 루프 내 변수 배치
              const colorStyle = NotificationColorConfig[categoryName];

              return (
                <li
                  key={id}
                  className="hover:bg-btn-hover cursor-pointer border-b border-border-main"
                >
                  <Link
                    href={"/"}
                    className="flex justify-between pt-3.75 px-2.5 pb-5"
                  >
                    <div className="flex flex-col gap-1.5 font-medium">
                      {/* 공지사항 분류 공지/업데이트/이벤트 */}
                      <span
                        className={cn(
                          "rounded-md py-1 px-2 w-fit text-[13px]",
                          colorStyle.bg,
                          colorStyle.color,
                        )}
                      >
                        {categoryName}
                      </span>

                      {/* 공지사항 제목 */}
                      <p className="text-sm">{title}</p>
                    </div>
                    <time
                      dateTime={dayjs(createdAt).format("YYYY-MM-DD")}
                      className="text-[13px] text-font-2"
                    >
                      {dayjs(createdAt).format("YYYY-MM-DD")}
                    </time>
                  </Link>
                </li>
              );
            },
          )}
        </ul>
      </div>
    </section>
  );
};

export default NotificationPage;
