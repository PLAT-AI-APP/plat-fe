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
  /**
   * block  카드 한 장을 차지한다. 섹션·목록·패널이 통째로 비었을 때.
   * inline 한 줄만 쓴다. 입력칸 아래·업로더 타일처럼 자리가 좁을 때.
   */
  variant?: "block" | "inline";
  className?: string;
}

/**
 * 자원을 불러오지 못했을 때 그 자리에 남는 표시.
 *
 * 전역 토스트는 지나가면 사라지므로, 실패한 영역 자체에도 흔적이 남아야
 * 사용자가 "왜 여기가 비었는지" 알 수 있다. 개발 모드에서는 어느 요청이
 * 깨졌는지까지 함께 보여준다.
 */
const ErrorState = ({
  error,
  onRetry,
  variant = "block",
  className,
}: ErrorStateProps) => {
  const t = useTranslations("state");
  const detail = formatErrorDetail(error);
  // 4xx 는 다시 눌러도 답이 같다. 재시도 버튼을 띄우면 사용자를 헛수고시킨다.
  const canRetry = Boolean(onRetry) && isRetryableError(error);

  if (variant === "inline") {
    return (
      <p
        role="alert"
        className={cn(
          "body-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-font-error",
          className,
        )}
      >
        <span>{resolveErrorMessage(error)}</span>
        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="title-7 underline underline-offset-2 hover:text-font-1"
          >
            {t("retry")}
          </button>
        )}
      </p>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-2xl bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <p className="body-4 text-font-1">{resolveErrorMessage(error)}</p>

      {detail && (
        <code className="body-7 max-w-full truncate text-font-disabled">
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
