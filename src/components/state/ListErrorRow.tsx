"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { isRetryableError, resolveErrorMessage } from "@/lib/apiError";

interface ListErrorRowProps {
  error: unknown;
  /** 보통 fetchNextPage 를 그대로 넘깁니다. */
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}

/**
 * 무한 목록의 다음 쪽을 못 가져왔을 때, 목록 맨 아래에 붙는 줄.
 *
 * 이미 보고 있던 목록을 통째로 에러 화면으로 갈아치우면 안 된다. 2쪽을 못
 * 가져온 것과 1쪽부터 못 가져온 것은 사용자에게 전혀 다른 사건인데,
 * 예전에는 isError 하나로 뭉뚱그려 이미 읽고 있던 목록까지 사라졌다.
 * 여기서 알릴 것은 "여기까지"라는 사실 하나뿐이다.
 */
const ListErrorRow = ({
  error,
  onRetry,
  isRetrying = false,
  className,
}: ListErrorRowProps) => {
  const t = useTranslations("state");
  const canRetry = isRetryableError(error);

  return (
    <div
      role="alert"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 py-6 text-center",
        className,
      )}
    >
      <p className="body-6 text-font-2">
        {canRetry ? t("loadMoreFailed") : resolveErrorMessage(error)}
      </p>

      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="title-6 rounded-lg bg-btn-hover px-3 py-1.5 text-font-1 hover:bg-btn-selected disabled:pointer-events-none disabled:text-font-disabled"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
};

export default ListErrorRow;
