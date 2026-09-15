"use client";

import { Fragment, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRoomListInfiniteQuery } from "@/api/room/getRoomList";
import { useInfiniteList } from "@/hooks/data/useInfiniteList";
import { InfiniteQueryBoundary } from "@/components/state";
import ChattingItem from "./ChattingItem";

const SKELETON_ITEM_COUNT = 5;

const ChattingListSkeleton = () => (
  <ul className="flex flex-col gap-2">
    {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
      <li key={index} className="flex gap-3 rounded-lg px-4 py-3">
        <div className="skeleton size-[84px] shrink-0 rounded-2xl" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <div className="skeleton h-5 w-1/3 rounded-full" />
          <div className="skeleton h-4 w-2/3 rounded-full" />
        </div>
      </li>
    ))}
  </ul>
);

interface ChattingListProps {
  searchQuery: string;
}

const ChattingList = ({ searchQuery }: ChattingListProps) => {
  const t = useTranslations("myChatting");
  const {
    data,
    error,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRoomListInfiniteQuery();

  const { items, hasItems, sentinelRef } = useInfiniteList({
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // 검색은 이미 받아 둔 쪽(title/마지막 메시지)만 거른다 — /rooms는 검색어 파라미터를 지원하지 않는다.
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredItems = useMemo(
    () =>
      normalizedSearchQuery
        ? items.filter((room) =>
            [room.title, room.lastMessage].some((value) =>
              value.toLowerCase().includes(normalizedSearchQuery),
            ),
          )
        : items,
    [items, normalizedSearchQuery],
  );

  return (
    <section>
      <InfiniteQueryBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        hasItems={hasItems}
        isEmpty={filteredItems.length === 0}
        isFetchingNextPage={isFetchingNextPage}
        onRetry={refetch}
        onRetryNextPage={fetchNextPage}
        pendingFallback={<ChattingListSkeleton />}
        emptyMessage={t("empty")}
      >
        <ul className="flex flex-col gap-2">
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- 아래 구분선 주석과 함께 index도 임시로 미사용 */}
          {filteredItems.map((room, index) => (
            <Fragment key={room.roomId}>
              <ChattingItem
                roomId={room.roomId}
                title={room.title}
                thumbnailUrl={room.thumbnailUrl}
                lastMessage={room.lastMessage}
                isPinned={room.isPinned}
              />

              {/* 추후 다시 필요해질 수 있어 삭제 대신 주석 처리합니다.
              {index < filteredItems.length - 1 && (
                <li className="mx-10 h-px bg-main" aria-hidden="true" />
              )} */}
            </Fragment>
          ))}
        </ul>

        {hasNextPage && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
      </InfiniteQueryBoundary>
    </section>
  );
};

export default ChattingList;
