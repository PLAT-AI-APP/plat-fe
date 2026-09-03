"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  formatErrorDetail,
  isRetryableError,
  resolveErrorMessage,
} from "@/lib/apiError";

interface ErrorStateProps {
  error: unknown;
  /** 넘기면 재시도 버튼이 나타납니다. 보통 react-query의 refetch를 그대로 넘깁니다. */
  onRetry?: () => void;
  className?: string;
}

/**
 * 자원을 불러오지 못했을 때 그 자리에 남는 표시.
 *
 * 전역 토스트는 지나가면 사라지므로, 실패한 영역 자체에도 흔적이 남아야
 * 사용자가 "왜 여기가 비었는지" 알 수 있다. 개발 모드에서는 어느 요청이
 * 깨졌는지까지 함께 보여준다.
 */
const ErrorState = ({ error, onRetry, className }: ErrorStateProps) => {
  const t = useTranslations("state");
  const detail = formatErrorDetail(error);
  const canRetry = Boolean(onRetry) && isRetryableError(error);

  return (
    <div
      role="alert"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-2xl bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <p className="body-3 text-font-1">{resolveErrorMessage(error)}</p>

      {detail && (
        <code className="body-6 max-w-full truncate text-font-disabled">
          {detail}
        </code>
      )}

      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="title-5 mt-1 rounded-lg bg-btn-hover px-4 py-2 text-font-1 transition-colors hover:bg-btn-selected"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
