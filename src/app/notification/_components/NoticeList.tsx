"use client";
import { useNoticeListInfiniteQuery } from "@/api/notice/getNoticeList";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import PinFill from "@/icons/PinFill";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { NoticeCategory } from "@/type/notice";

const NOTICE_CATEGORY_STYLE: Record<
  NoticeCategory,
  { bg: string; color: string; labelKey: string }
> = {
  SERVICE: {
    bg: "bg-info-bg",
    color: "text-info",
    labelKey: "notification.filters.service",
  },
  UPDATE: {
    bg: "bg-success-bg",
    color: "text-success",
    labelKey: "notification.filters.update",
  },
  EVENT: {
    bg: "bg-warning-bg",
    color: "text-warning",
    labelKey: "notification.filters.event",
  },
  MAINTENANCE: {
    bg: "bg-warning-bg",
    color: "text-warning",
    labelKey: "notification.filters.maintenance",
  },
  POLICY: {
    bg: "bg-info-bg",
    color: "text-info",
    labelKey: "notification.filters.policy",
  },
};

interface NoticeListProps {
  currentFilter: NoticeCategory | null | undefined;
}

const NoticeList = ({ currentFilter }: NoticeListProps) => {
  const t = useTranslations();
  const {
    data: noticeListData,
    fetchNextPage,
    hasNextPage, // 다음 페이지 존재 여부
    isFetchingNextPage, // 추가 데이터 요청 진행 상태
  } = useNoticeListInfiniteQuery();

  // 서버가 분류 필터를 받지 않으므로 받아온 목록에서 걸러냅니다.
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
      {noticeList.map(({ category, createdAt, isPinned, noticeId, title }) => {
        const colorStyle = NOTICE_CATEGORY_STYLE[category];

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
                {/* 공지사항 분류 배지 */}
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
                  {colorStyle && (
                    <span
                      className={cn(
                        "rounded-md py-1 px-2 w-fit caption-2",
                        colorStyle.bg,
                        colorStyle.color,
                      )}
                    >
                      {t(colorStyle.labelKey)}
                    </span>
                  )}
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
