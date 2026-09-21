"use client";

import type { ReactNode } from "react";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

interface QueryStateBoundaryProps {
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  /** 요청은 성공했는데 결과가 비었는지. 넘기지 않으면 빈 상태 분기를 쓰지 않습니다. */
  isEmpty?: boolean;
  onRetry?: () => void;
  /** 로딩 중 보여줄 스켈레톤. 없으면 아무것도 그리지 않습니다. */
  pendingFallback?: ReactNode;
  emptyMessage?: string;
  emptyFallback?: ReactNode;
  errorClassName?: string;
  children: ReactNode;
}

/**
 * 로딩 / 실패 / 빈 결과 / 정상, 네 갈래를 한곳에서 가른다.
 *
 * 화면마다 제각각 `if (!data) return null` 로 끝내는 바람에 실패가 조용히
 * 사라지거나 "결과 없음"으로 둔갑하던 것을 막기 위한 부품이다. 실패와 빈 결과를
 * 구조적으로 분리하는 것이 이 컴포넌트의 존재 이유다.
 */
const QueryStateBoundary = ({
  isPending,
  isError,
  error,
  isEmpty = false,
  onRetry,
  pendingFallback = null,
  emptyMessage,
  emptyFallback,
  errorClassName,
  children,
}: QueryStateBoundaryProps) => {
  // 스켈레톤을 거쳐 들어온 콘텐츠만 부드럽게 나타나게 한다.
  const fadeInClassName = useFadeInAfterLoading(isPending);

  if (isPending) return <>{pendingFallback}</>;

  if (isError) {
    return (
      <ErrorState error={error} onRetry={onRetry} className={errorClassName} />
    );
  }

  if (isEmpty) {
    if (emptyFallback) return <>{emptyFallback}</>;
    if (emptyMessage) return <EmptyState message={emptyMessage} />;
    return null;
  }

  // key 는 스켈레톤과 같은 종류의 요소(div)일 때 DOM 이 재사용돼 애니메이션이 재생되지 않는 것을 막는다.
  if (fadeInClassName) {
    return (
      <div key="content" className={fadeInClassName}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default QueryStateBoundary;
