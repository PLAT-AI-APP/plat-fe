"use client";

import { useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

/**
 * 백엔드의 PageWith/SliceWith 가 공통으로 갖는 부분만 본다.
 *
 * page 는 unknown 으로 둔다. 목록마다 페이지 정보의 모양이 조금씩 다르고
 * (전체 개수를 세는 것과 안 세는 것), 여기서 필요한 건 content 뿐이다.
 */
interface PageLike<T> {
  content: T[];
  page?: unknown;
}

/** 전체 개수를 세는 목록만 이 값을 갖는다. */
const readTotalElements = (page: unknown): number | undefined => {
  if (typeof page !== "object" || page === null) return undefined;
  const value = (page as { totalElements?: unknown }).totalElements;
  return typeof value === "number" ? value : undefined;
};

interface InfiniteQueryLike<T> {
  data?: { pages: PageLike<T>[] };
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

interface UseInfiniteListOptions {
  /** 바닥 감지를 끌지 여부. 목록이 숨겨진 탭에 있을 때 등. */
  enabled?: boolean;
  rootMargin?: string;
}

/**
 * 무한 목록의 반복되는 뒷일을 한곳에 모은다.
 *
 * 여섯 화면이 똑같이 `pages.flatMap(p => p.content)` 로 펼치고, 똑같이
 * `hasNextPage && !isFetchingNextPage` 를 확인하는 관찰자를 달고 있었다.
 *
 * 옮기면서 한 가지를 고친다. useIntersectionObserver 는 onIntersect 를 효과의
 * 의존성으로 갖는데, 호출부가 모두 인라인 화살표를 넘기고 있어 렌더마다 새
 * 함수가 만들어졌고 그때마다 IntersectionObserver 가 해제·재생성됐다.
 * 여기서 useCallback 으로 묶어 한 번만 만들어지게 한다.
 *
 * 실패 표현은 이 훅이 정하지 않는다. InfiniteQueryBoundary 가 hasItems 를 보고
 * "전체 에러 화면"과 "목록 아래 한 줄"을 가른다.
 */
export const useInfiniteList = <T>(
  query: InfiniteQueryLike<T>,
  { enabled = true, rootMargin }: UseInfiniteListOptions = {},
) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  const items = data?.pages.flatMap((page) => page.content) ?? [];

  const handleIntersect = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { targetRef } = useIntersectionObserver({
    onIntersect: handleIntersect,
    enabled: enabled && Boolean(hasNextPage),
    ...(rootMargin ? { rootMargin } : {}),
  });

  return {
    items,
    hasItems: items.length > 0,
    /** 전체 개수를 세는 목록(PageWith)만 값이 있다. */
    totalCount: readTotalElements(data?.pages[0]?.page),
    /** 목록 맨 아래에 두면 바닥에 닿을 때 다음 쪽을 부른다. */
    sentinelRef: targetRef,
  };
};
