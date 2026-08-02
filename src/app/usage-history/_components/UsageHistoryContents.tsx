"use client";
import { useUsageHistoryListQuery } from "@/api/note/getUsageHistoryList";
import React from "react";
import UsageHistoryItem from "./UsageHistoryItem";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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

  // 로딩 및 에러 처리
  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러오지 못했습니다.</div>;

  return (
    <section className="max-w-135 w-full mx-auto pt-5">
      <ul id="usage-history-list" className="flex flex-col gap-2">
        {usageHistoryList?.map((item) => {
          return <UsageHistoryItem key={item.ledgerId} item={item} />;
        })}

        <div ref={targetRef}></div>
      </ul>
    </section>
  );
};

export default UsageHistoryContents;
