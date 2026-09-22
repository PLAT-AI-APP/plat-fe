"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { useMyQnaListQuery } from "@/api/qna/getMyQnaList";
import { useInfiniteList } from "@/hooks/data/useInfiniteList";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { InfiniteQueryBoundary } from "@/components/state";
import CustomerServiceHeader from "../../_components/CustomerServiceHeader";
import MyQnaItem from "./MyQnaItem";

const PAGE_SIZE = 20;
const SKELETON_ITEM_COUNT = 4;

/** 나의 Q&A. 직접 남긴 문의와 환불 신청이 함께 최신순으로 보인다. */
const MyQnaContents = () => {
  const t = useTranslations("customerService.qna");

  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyQnaListQuery({ size: PAGE_SIZE });

  const { items, hasItems, sentinelRef } = useInfiniteList({
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <section className="mx-auto flex w-full max-w-155 flex-col gap-6 pt-5">
      <CustomerServiceHeader />

      <div className="flex justify-end">
        <Link
          href="/customer-service/qna/new"
          className={buttonStyles({ variant: "primary", size: "sm" })}
        >
          {t("ask")}
        </Link>
      </div>

      <InfiniteQueryBoundary
        isPending={isLoading}
        isError={isError}
        error={error}
        hasItems={hasItems}
        isEmpty={Boolean(data) && !hasItems}
        isFetchingNextPage={isFetchingNextPage}
        onRetry={refetch}
        onRetryNextPage={fetchNextPage}
        emptyMood="peek"
        emptyMessage={t("empty")}
        pendingFallback={
          <ul className="flex flex-col gap-2">
            {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
              <li key={index} className="h-24 w-full rounded-2xl skeleton" />
            ))}
          </ul>
        }
      >
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <MyQnaItem key={item.qnaId} item={item} />
          ))}

          {hasNextPage && <div ref={sentinelRef} />}
        </ul>
      </InfiniteQueryBoundary>
    </section>
  );
};

export default MyQnaContents;
