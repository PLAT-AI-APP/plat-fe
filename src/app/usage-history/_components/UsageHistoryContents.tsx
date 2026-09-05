"use client";
import { useUsageHistoryListQuery } from "@/api/note/getUsageHistoryList";
import React from "react";
import UsageHistoryItem from "./UsageHistoryItem";
import SkeletonUsageHistoryItem from "./SkeletonUsageHistoryItem";
import { useInfiniteList } from "@/hooks/useInfiniteList";
import PageTitle from "@/components/PageTitle";
import { InfiniteQueryBoundary } from "@/components/state";

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

  const {
    items: usageHistoryList,
    hasItems,
    sentinelRef,
  } = useInfiniteList({
    data: usageHistoryListData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <section className="max-w-135 w-full mx-auto pt-5">
      <PageTitle messageKey="pageTitles.usageHistory" />

      {/*
       * 2쪽을 못 가져온 것과 1쪽부터 못 가져온 것은 다른 사건이다.
       * 예전에는 isError 하나로 뭉뚱그려, 스무 줄을 읽고 있다가 다음 쪽이
       * 실패하면 읽고 있던 목록까지 통째로 에러 화면에 덮였다.
       * 이제 이미 받은 줄은 남고 맨 아래에 다시 시도 한 줄만 붙는다.
       */}
      <InfiniteQueryBoundary
        isPending={isLoading}
        isError={isError}
        error={error}
        hasItems={hasItems}
        isFetchingNextPage={isFetchingNextPage}
        onRetry={refetch}
        onRetryNextPage={fetchNextPage}
        pendingFallback={
          <ul className="flex flex-col gap-2">
            {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
              <SkeletonUsageHistoryItem key={index} />
            ))}
          </ul>
        }
      >
        <ul id="usage-history-list" className="flex flex-col gap-2">
          {usageHistoryList.map((item) => (
            <UsageHistoryItem key={item.ledgerId} item={item} />
          ))}

          {hasNextPage && <div ref={sentinelRef} />}
        </ul>
      </InfiniteQueryBoundary>
    </section>
  );
};

export default UsageHistoryContents;
