"use client";

import { useNoticeListInfiniteQuery } from "@/api/notice/getNoticeList";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import dayjs from "@/lib/dayjs";

const NotificationColorConfig: Record<string, { bg: string; color: string }> = {
  NOTICE: {
    bg: "bg-[#0088FF26]",
    color: "text-[#0088FF]",
  },
  UPDATE: {
    bg: "bg-[#34C75926]",
    color: "text-[#34C759]",
  },
  EVENT: {
    bg: "bg-[#FFCC0026]",
    color: "text-[#FFCC00]",
  },
};

const NoticeList = () => {
  const { data: noticeListData } = useNoticeListInfiniteQuery();
  const noticeList = noticeListData?.pages[0].content;
  //   const b = a?.map(({ content }) => content);
  return (
    <ul>
      {noticeList?.map(({ createdAt, isPinned, noticeId, title, type }) => {
        // 루프 내 변수 배치
        const colorStyle = NotificationColorConfig[type];

        return (
          <li
            key={noticeId}
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
                  {type}
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
      })}
    </ul>
  );
};

export default NoticeList;
