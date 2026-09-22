"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import EmptyMascot from "./EmptyMascot";
import Button from "@/components/ui/Button";
import {
  formatErrorDetail,
  isRetryableError,
  isSuppressedError,
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
  /**
   * block 에서 어질어질한 캐릭터를 함께 보여준다(기본). 태그 목록처럼 좁은
   * 자리에서는 false 로 끄고 예전 카드 모양을 쓴다.
   */
  withMascot?: boolean;
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
  withMascot = true,
  className,
}: ErrorStateProps) => {
  const t = useTranslations("state");
  const detail = formatErrorDetail(error);
  // 4xx 는 다시 눌러도 답이 같다. 재시도 버튼을 띄우면 사용자를 헛수고시킨다.
  const canRetry = Boolean(onRetry) && isRetryableError(error);

  // 세션 만료는 이미 LOGIN_REQUIRED 다이얼로그가 안내한다. 여기서 또 그리면
  // 같은 내용을 두 번 말하고, 로그인해야 풀리는데 재시도 버튼까지 뜬다.
  if (isSuppressedError(error)) return null;

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
        "flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center",
        // 캐릭터를 쓸 때는 빈 화면처럼 면 없이 배경 위에 둔다. 카드 면 위에서는 캐릭터가 묻힌다.
        !withMascot && "rounded-2xl bg-card",
        className,
      )}
    >
      {withMascot && (
        <EmptyMascot
          mood="dizzy"
          className="w-44 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
        />
      )}

      <p className="body-4 text-font-1">{resolveErrorMessage(error)}</p>

      {detail && (
        <code className="body-7 max-w-full truncate text-font-disabled">
          {detail}
        </code>
      )}

      {canRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          // 카드 면 위에서는 secondary 면(bg-card)이 묻히므로 한 단계 밝은 면을 쓴다.
          className={cn("mt-1", !withMascot && "bg-btn-hover hover:bg-btn-selected")}
        >
          {t("retry")}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
