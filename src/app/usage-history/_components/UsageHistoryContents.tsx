"use client";
import { useUsageHistoryListQuery } from "@/api/note/getUsageHistoryList";
import React from "react";
import UsageHistoryItem from "./UsageHistoryItem";
import SkeletonUsageHistoryItem from "./SkeletonUsageHistoryItem";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import PageTitle from "@/components/PageTitle";
import { ErrorState } from "@/components/state";

const SKELETON_ITEM_COUNT = 6;

const UsageHistoryContents = () => {
  // 상태 및 데이터
  const {
    data: usageHistoryListData,
    error,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsageHistoryListQuery({ size: 20 });

  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const usageHistoryList =
    usageHistoryListData?.pages.flatMap((page) => page.content) ?? [];

  // 서버가 준 사유를 버리고 고정 문구만 보여주면 사용자도 지원 담당자도 원인을 알 수 없다.
  // ErrorState 는 실제 메시지와(개발 모드에서는) 실패한 요청까지 함께 보여준다.
  if (isError) {
    return (
      <section className="mx-auto w-full max-w-135 pt-5">
        <PageTitle messageKey="pageTitles.usageHistory" />
        <ErrorState error={error} onRetry={refetch} />
      </section>
    );
  }

  return (
    <section className="max-w-135 w-full mx-auto pt-5">
      <PageTitle messageKey="pageTitles.usageHistory" />

      <ul id="usage-history-list" className="flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
              <SkeletonUsageHistoryItem key={index} />
            ))
          : usageHistoryList?.map((item) => {
              return <UsageHistoryItem key={item.ledgerId} item={item} />;
            })}

        <div ref={targetRef}></div>
      </ul>
    </section>
  );
};

export default UsageHistoryContents;
