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
import { EmptyState, ErrorState } from "@/components/state";

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

/** 목록이 들어설 자리를 잡아 둡니다. 높이를 실제 줄에 맞춰 로딩이 끝날 때 화면이 튀지 않게 합니다. */
const NoticeListSkeleton = () => (
  <ul aria-hidden="true">
    {Array.from({ length: 6 }).map((_, index) => (
      <li key={index} className="border-b border-main">
        <div className="flex justify-between px-2.5 pt-4 pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="skeleton h-6 w-14 rounded-md" />
            <div className="skeleton h-6 w-64 max-w-full rounded-full" />
          </div>
          <div className="skeleton h-4 w-20 rounded-full" />
        </div>
      </li>
    ))}
  </ul>
);

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
    isPending,
    isError,
    error,
    refetch,
  } = useNoticeListInfiniteQuery({ category: currentFilter });

  // 분류는 서버가 걸러 주므로 받아온 것을 그대로 씁니다.
  const noticeList = noticeListData?.pages.flatMap((page) => page.content) ?? [];

  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  if (isPending) return <NoticeListSkeleton />;

  // 실패를 "아직 공지가 없어요"로 뭉개면 서버가 죽은 걸 정상으로 읽게 됩니다.
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  if (noticeList.length === 0) {
    return (
      <EmptyState
        message={t(
          currentFilter ? "notification.emptyFiltered" : "notification.empty",
        )}
      />
    );
  }

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
                className="body-6 text-font-2"
              >
                {dayjs(createdAt).format("YYYY-MM-DD")}
              </time>
            </Link>
          </li>
        );
      })}

      {hasNextPage && <div ref={targetRef} className="h-0.5" />}
      {isFetchingNextPage && (
        <li aria-hidden="true" className="flex flex-col gap-3 px-2.5 py-4">
          <div className="skeleton h-5 w-16 rounded-md" />
          <div className="skeleton h-5 w-2/3 rounded-full" />
        </li>
      )}
    </ul>
  );
};

export default NoticeList;
