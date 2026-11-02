"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import Button from "@/components/ui/Button";
import { ImageIcon } from "@/icons";
import { useImageAppeal } from "@/hooks/data/useImageAppeal";
import {
  getImageReasonKey,
  getReviewFocus,
  isBlockingImage,
  withReviewFocus,
} from "@/lib/imageReview";
import { cn } from "@/lib/utils";
import type { ReviewImage } from "@/type/card";
import type { ContentReviewDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const RING_CLASS: Record<ReviewImage["status"], string> = {
  REJECTED: "ring-2 ring-danger",
  ADULT_SETTING_REQUIRED: "ring-2 ring-warning",
  PENDING: "",
};

const STATUS_CLASS: Record<ReviewImage["status"], string> = {
  REJECTED: "text-danger",
  ADULT_SETTING_REQUIRED: "text-warning",
  PENDING: "text-font-2",
};

/**
 * 내 캐릭터가 왜 아직 보이지 않는지. 반려면 사유와 고칠 곳(본문·이미지)을 보여 주고 수정 화면으로 보낸다.
 * 검수 중·운영자 확인 중이면 기다리면 된다는 것만 알린다.
 */
const ContentReviewDialog = ({ onClose, review, editHref }: ContentReviewDialogProps) => {
  const t = useTranslations("dialog.contentReview");
  const imageT = useTranslations("imageReview");
  const router = useRouter();
  // 창이 연 뒤 받은 카드 값은 바뀌지 않으므로, 이 창에서 이의 신청한 것은 따로 기억한다.
  const [appealedIds, setAppealedIds] = useState<string[]>([]);
  const { appeal, pendingFileId } = useImageAppeal((fileId) =>
    setAppealedIds((prev) => [...prev, fileId]),
  );
  const images = (review.images ?? []).map((image) =>
    appealedIds.includes(image.fileId)
      ? { ...image, status: "PENDING" as const, appealed: true, appealable: false }
      : image,
  );
  const isBodyRejected =
    review.status === "REJECTED" && (Boolean(review.reason) || review.findings.length > 0);
  const blockingCount = images.filter(isBlockingImage).length;
  // 이 창에서 이의 신청해 고칠 이미지가 남지 않으면 반려가 아니라 운영자 확인 대기로 바뀐다.
  const isRejected =
    isBodyRejected || blockingCount > 0 || (review.status === "REJECTED" && images.length === 0);
  const isAwaitingAdmin = review.awaitingAdmin || images.some((image) => image.appealed);
  const title = isRejected
    ? t("rejectedTitle")
    : isAwaitingAdmin
      ? t("awaitingAdminTitle")
      : t("pendingTitle");

  const goEdit = (image?: ReviewImage) => {
    onClose();
    router.push(image ? withReviewFocus(editHref, getReviewFocus(image)) : editHref);
  };

  const summary = isBodyRejected ? (
    <p className="body-5 w-full whitespace-pre-line break-keep text-font-2">
      {review.reason || t("rejectedFallback")}
    </p>
  ) : isRejected && blockingCount > 0 ? null : isRejected ? (
    <p className="body-5 w-full whitespace-pre-line break-keep text-font-2">
      {t("rejectedFallback")}
    </p>
  ) : (
    <p className="body-5 w-full whitespace-pre-line break-keep text-font-2">
      {review.awaitingAdmin ? t("awaitingAdminDescription") : t("pendingDescription")}
    </p>
  );

  const hasFixList = (isBodyRejected && review.findings.length > 0) || images.length > 0;

  const description = (
    <div className="flex w-full flex-col gap-4">
      {summary}
      {hasFixList && (
        <div className="flex w-full flex-col gap-2">
          <p className="title-6 text-font-1">{t("findingsTitle")}</p>
          <ul className="flex max-h-[45dvh] flex-col gap-2 overflow-y-auto">
            {isBodyRejected &&
              review.findings.map((finding, index) => (
                <li
                  key={`${finding.language}-${finding.field}-${index}`}
                  className="flex flex-col gap-1 rounded-xl bg-card px-3.5 py-3"
                >
                  <span className="body-8 text-font-disabled">
                    {t(`fields.${finding.field}`)} · {finding.language}
                  </span>
                  <span className="body-6 whitespace-pre-line break-keep text-font-1">{finding.guide}</span>
                </li>
              ))}
            {images.map((image) => (
              <li key={image.fileId} className="flex gap-3 rounded-xl bg-card px-3.5 py-3">
                <div
                  className={cn(
                    "relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card-selected",
                    RING_CLASS[image.status],
                  )}
                >
                  {image.imageUrl ? (
                    <ResourceImage
                      src={image.imageUrl}
                      alt={imageT("imageAlt")}
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-5 text-font-disabled" aria-hidden="true" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="body-8 text-font-disabled">{imageT(`usage.${image.usage}`)}</span>
                  <span className={cn("title-6", STATUS_CLASS[image.status])}>
                    {image.status === "PENDING" && image.appealed
                      ? imageT("status.appealed")
                      : imageT(`status.${image.status}`)}
                  </span>
                  {getImageReasonKey(image) && (
                    <span className="body-7 whitespace-pre-line break-keep text-font-2">
                      {imageT(`reasons.${getImageReasonKey(image)}`)}
                    </span>
                  )}
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-card-selected"
                      onClick={() => goEdit(image)}
                    >
                      {imageT("replace")}
                    </Button>
                    {image.appealable && !image.appealed && (
                      <Button
                        variant="outline"
                        size="sm"
                        isPending={pendingFileId === image.fileId}
                        disabled={pendingFileId === image.fileId}
                        onClick={() => appeal(image.fileId)}
                      >
                        {imageT("appeal")}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // 본문이 멀쩡하면 "수정하기"도 첫 번째 고칠 이미지 칸으로 바로 보낸다.
  const firstFixImage = isBodyRejected ? undefined : images.find(isBlockingImage);

  return (
    <Dialog
      onClose={onClose}
      label={<h2 className="title-2 w-full text-font-1">{title}</h2>}
      description={description}
      cancelFn={isRejected ? onClose : undefined}
      cancelText="dialog.contentReview.close"
      confirmText={isRejected ? "dialog.contentReview.edit" : "common.confirm"}
      confirmFn={() => {
        if (isRejected) {
          goEdit(firstFixImage);
          return;
        }
        onClose();
      }}
    />
  );
};

export default ContentReviewDialog;
