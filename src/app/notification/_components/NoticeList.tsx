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
  SERVICE: {
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
  MAINTENANCE: {
    bg: "bg-info-bg",
    color: "text-info",
    label: "점검",
  },
  POLICY: {
    bg: "bg-info-bg",
    color: "text-info",
    label: "정책",
  },
};

interface NoticeListProps {
  currentFilter:
    | "SERVICE"
    | "UPDATE"
    | "EVENT"
    | "MAINTENANCE"
    | "POLICY"
    | null
    | undefined;
}
const NoticeList = ({ currentFilter }: NoticeListProps) => {
  const {
    data: noticeListData,
    fetchNextPage,
    hasNextPage, // 다음 페이지 존재 여부
    isFetchingNextPage, // 추가 데이터 요청 진행 상태
  } = useNoticeListInfiniteQuery();

  // 실서버 GET /notices는 카테고리 필터 쿼리를 지원하지 않아, 불러온 목록을 클라이언트에서 걸러냅니다.
  const noticeList = (
    noticeListData?.pages.flatMap((page) => page.content) ?? []
  ).filter((notice) => !currentFilter || notice.category === currentFilter);

  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });
  return (
    <ul>
      {noticeList?.map(({ createdAt, isPinned, noticeId, title, category }) => {
        const colorStyle = NotificationConfig[category];

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
