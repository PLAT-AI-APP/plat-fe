"use client";

import type { ReactNode } from "react";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import ListErrorRow from "./ListErrorRow";

interface InfiniteQueryBoundaryProps {
  /** 아직 한 쪽도 못 받았는지. 보통 !data 또는 items.length === 0 && isPending. */
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  /** 이미 화면에 그려진 항목이 있는지. 이 값이 실패의 표현을 가른다. */
  hasItems: boolean;
  /** 요청은 성공했는데 결과가 0건인지. */
  isEmpty?: boolean;
  isFetchingNextPage?: boolean;
  /** 첫 쪽 재요청. */
  onRetry?: () => void;
  /** 다음 쪽 재요청. 보통 fetchNextPage. */
  onRetryNextPage?: () => void;
  pendingFallback?: ReactNode;
  emptyMessage?: string;
  emptyFallback?: ReactNode;
  children: ReactNode;
}

/**
 * 무한 목록에서 로딩 / 실패 / 빈 결과 / 정상을 가른다.
 *
 * QueryStateBoundary 와 나누는 이유는 무한 목록에만 있는 갈래 때문이다 —
 * **이미 받아 둔 것이 있는 상태에서의 실패**. 그때 목록을 지우고 에러 화면을
 * 띄우면, 사용자가 읽고 있던 내용을 실패가 빼앗아 간다. 그래서 규칙을
 * 컴포넌트로 못 박는다.
 *
 *   항목 없음 + 실패  → 영역 전체를 ErrorState 로
 *   항목 있음 + 실패  → 목록은 그대로 두고 맨 아래에 ListErrorRow 한 줄
 */
const InfiniteQueryBoundary = ({
  isPending,
  isError,
  error,
  hasItems,
  isEmpty = false,
  isFetchingNextPage = false,
  onRetry,
  onRetryNextPage,
  pendingFallback = null,
  emptyMessage,
  emptyFallback,
  children,
}: InfiniteQueryBoundaryProps) => {
  if (isPending && !hasItems) return <>{pendingFallback}</>;

  if (isError && !hasItems) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (!hasItems && isEmpty) {
    if (emptyFallback) return <>{emptyFallback}</>;
    if (emptyMessage) return <EmptyState message={emptyMessage} />;
    return null;
  }

  return (
    <>
      {children}
      {isError && onRetryNextPage && (
        <ListErrorRow
          error={error}
          onRetry={onRetryNextPage}
          isRetrying={isFetchingNextPage}
        />
      )}
    </>
  );
};

export default InfiniteQueryBoundary;
