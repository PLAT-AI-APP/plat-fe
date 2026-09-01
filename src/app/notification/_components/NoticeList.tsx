"use client";
import { useNoticeListInfiniteQuery } from "@/api/notice/getNoticeList";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import dayjs from "@/lib/dayjs";
import PinFill from "@/icons/PinFill";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const NotificationConfig: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  NOTICE: {
    bg: "bg-info-bg",
    color: "text-info",
    label: "공지",
  },
  UPDATE: {
    bg: "bg-success-bg",
    color: "text-success",
    label: "업데이트",
  },
  EVENT: {
    bg: "bg-warning-bg",
    color: "text-warning",
    label: "이벤트",
  },
};

interface NoticeListProps {
  currentFilter: "NOTICE" | "UPDATE" | "EVENT" | null | undefined;
}
const NoticeList = ({ currentFilter }: NoticeListProps) => {
  const {
    data: noticeListData,
    fetchNextPage,
    hasNextPage, // 다음 페이지 존재 여부
    isFetchingNextPage, // 추가 데이터 요청 진행 상태
  } = useNoticeListInfiniteQuery({
    type: currentFilter,
  });

  const noticeList =
    noticeListData?.pages.flatMap((page) => page.content) ?? [];

  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });
  return (
    <ul>
      {noticeList?.map(({ createdAt, isPinned, noticeId, title, type }) => {
        const colorStyle = NotificationConfig[type];

        return (
          <li
            key={noticeId}
            className={cn(
              "hover:bg-btn-hover cursor-pointer border-b border-main",
              isPinned && "bg-btn-hover",
            )}
          >
            <Link
              href={`/notification/${noticeId}`}
              className="flex justify-between pt-4 px-2.5 pb-5"
            >
              <div className="flex flex-col gap-1.5">
                {/* 공지사항 분류 공지/업데이트/이벤트 */}
                <div className="flex gap-1.5">
                  {isPinned && (
                    <span
                      className={cn(
                        "flex items-center rounded-md py-1 px-2 w-fit bg-brand-opacity",
                      )}
                    >
                      <PinFill className="w-3.5 h-3.5 text-brand" />
                    </span>
                  )}
                  <span
                    className={cn(
                      "rounded-md py-1 px-2 w-fit caption-2",
                      colorStyle.bg,
                      colorStyle.color,
                    )}
                  >
                    {colorStyle.label}
                  </span>
                </div>

                {/* 공지사항 제목 */}
                <p className="title-5">{title}</p>
              </div>
              <time
                dateTime={dayjs(createdAt).format("YYYY-MM-DD")}
                className="body-5 text-font-2"
              >
                {dayjs(createdAt).format("YYYY-MM-DD")}
              </time>
            </Link>
          </li>
        );
      })}

      <div ref={targetRef} className="h-0.5"></div>
    </ul>
  );
};

export default NoticeList;
