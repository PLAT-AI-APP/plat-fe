"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { useImageAppeal } from "@/hooks/data/useImageAppeal";
import { cn } from "@/lib/utils";

export type ImageReviewTone = "danger" | "warning" | "neutral";

const TONE_CLASS: Record<ImageReviewTone, string> = {
  danger: "bg-danger-bg",
  warning: "bg-warning-bg",
  neutral: "bg-card",
};

const TITLE_CLASS: Record<ImageReviewTone, string> = {
  danger: "text-danger",
  warning: "text-warning",
  neutral: "text-font-1",
};

interface ImageReviewNoticeProps {
  tone: ImageReviewTone;
  title?: string;
  message?: string;
  /** 이미지 바꾸기 · 성인 설정으로 */
  action?: { label: string; onClick: () => void };
  /** 있으면 이의 신청 버튼을 함께 둔다 */
  appealFileId?: string | null;
  className?: string;
}

/** 반려된 이미지 칸 아래에 붙는 사유와 고치는 버튼 */
const ImageReviewNotice = ({
  tone,
  title,
  message,
  action,
  appealFileId,
  className,
}: ImageReviewNoticeProps) => {
  const t = useTranslations("imageReview");
  const { appeal, pendingFileId } = useImageAppeal();
  const isAppealing = Boolean(appealFileId) && pendingFileId === appealFileId;

  return (
    <div className={cn("flex flex-col gap-2 rounded-xl px-3.5 py-3", TONE_CLASS[tone], className)}>
      {title && <p className={cn("title-6 break-keep", TITLE_CLASS[tone])}>{title}</p>}
      {message && <p className="body-7 whitespace-pre-line break-keep text-font-2">{message}</p>}
      {(action || appealFileId) && (
        <div className="flex flex-wrap gap-2">
          {action && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-card-selected"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {appealFileId && (
            <Button
              variant="outline"
              size="sm"
              isPending={isAppealing}
              disabled={isAppealing}
              onClick={() => appeal(appealFileId)}
            >
              {t("appeal")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageReviewNotice;
