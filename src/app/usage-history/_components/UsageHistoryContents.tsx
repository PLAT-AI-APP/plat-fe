"use client";
import { useUsageHistoryListQuery } from "@/api/note/getUsageHistoryList";
import React from "react";
import UsageHistoryItem from "./UsageHistoryItem";
import SkeletonUsageHistoryItem from "./SkeletonUsageHistoryItem";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const SKELETON_ITEM_COUNT = 6;

const UsageHistoryContents = () => {
  // 상태 및 데이터
  const {
    data: usageHistoryListData,
    isLoading,
    isError,
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

  // 에러 처리
  if (isError) return <div>데이터를 불러오지 못했습니다.</div>;

  return (
    <section className="max-w-135 w-full mx-auto pt-5">
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
