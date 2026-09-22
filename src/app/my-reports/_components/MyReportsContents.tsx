"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMyReportListQuery } from "@/api/report/getMyReportList";
import { useMyReportQuery } from "@/api/report/getMyReport";
import { useInfiniteList } from "@/hooks/data/useInfiniteList";
import PageTitle from "@/components/PageTitle";
import { InfiniteQueryBoundary } from "@/components/state";
import MyReportItem from "./MyReportItem";
import SkeletonMyReportItem from "./SkeletonMyReportItem";

const PAGE_SIZE = 20;
const SKELETON_ITEM_COUNT = 5;

const MyReportsContents = () => {
  const t = useTranslations("myReports");
  // 알림 딥링크(/my-reports?reportId=)로 들어오면 그 신고를 펼친 채로 보여준다.
  const focusedReportId = useSearchParams().get("reportId") ?? "";

  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyReportListQuery({ size: PAGE_SIZE });

  const { items, hasItems, sentinelRef } = useInfiniteList({
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const isFocusedInList = items.some(
    (item) => item.reportId === focusedReportId,
  );

  // 오래된 신고는 첫 쪽에 없다. 그 한 건을 찾으려고 목록을 끝까지 넘기지 않고 단건으로 받아 맨 위에 둔다.
  // 목록을 더 내려 같은 신고가 나타나면 목록 쪽 카드만 남긴다.
  const { data: focusedReport } = useMyReportQuery(
    focusedReportId,
    Boolean(data) && !isFocusedInList,
  );
  const pinnedReport = !isFocusedInList ? focusedReport : undefined;

  return (
    <section className="max-w-135 w-full mx-auto pt-5">
      <PageTitle messageKey="pageTitles.myReports" />

      <InfiniteQueryBoundary
        isPending={isLoading}
        isError={isError}
        error={error}
        hasItems={hasItems || Boolean(pinnedReport)}
        isEmpty={Boolean(data) && !hasItems}
        isFetchingNextPage={isFetchingNextPage}
        onRetry={refetch}
        onRetryNextPage={fetchNextPage}
        emptyMood="peek"
        emptyMessage={t("empty")}
        pendingFallback={
          <ul className="flex flex-col gap-2">
            {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
              <SkeletonMyReportItem key={index} />
            ))}
          </ul>
        }
      >
        <ul id="my-report-list" className="flex flex-col gap-2">
          {pinnedReport && (
            <MyReportItem key={pinnedReport.reportId} item={pinnedReport} defaultOpen />
          )}
          {items.map((item) => (
            <MyReportItem
              key={item.reportId}
              item={item}
              defaultOpen={item.reportId === focusedReportId}
            />
          ))}

          {hasNextPage && <div ref={sentinelRef} />}
        </ul>
      </InfiniteQueryBoundary>
    </section>
  );
};

export default MyReportsContents;
