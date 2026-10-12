"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ContentReviewDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

/**
 * 내 캐릭터가 왜 아직 보이지 않는지. 반려면 사유와 고칠 곳을 보여 주고 수정 화면으로 보낸다.
 * 검수 중·운영자 확인 중이면 기다리면 된다는 것만 알린다.
 */
const ContentReviewDialog = ({ onClose, review, editHref }: ContentReviewDialogProps) => {
  const t = useTranslations("dialog.contentReview");
  const router = useRouter();
  const isRejected = review.status === "REJECTED";
  const title = isRejected
    ? t("rejectedTitle")
    : review.awaitingAdmin
      ? t("awaitingAdminTitle")
      : t("pendingTitle");

  const description = isRejected ? (
    <div className="flex w-full flex-col gap-4">
      <p className="body-5 w-full whitespace-pre-line break-keep text-font-2">
        {review.reason || t("rejectedFallback")}
      </p>
      {review.findings.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <p className="title-6 text-font-1">{t("findingsTitle")}</p>
          <ul className="flex flex-col gap-2">
            {review.findings.map((finding, index) => (
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
          </ul>
        </div>
      )}
    </div>
  ) : (
    <p className="body-5 w-full whitespace-pre-line break-keep text-font-2">
      {review.awaitingAdmin ? t("awaitingAdminDescription") : t("pendingDescription")}
    </p>
  );

  return (
    <Dialog
      onClose={onClose}
      label={<h2 className="title-2 w-full text-font-1">{title}</h2>}
      description={description}
      cancelFn={isRejected ? onClose : undefined}
      cancelText="dialog.contentReview.close"
      confirmText={isRejected ? "dialog.contentReview.edit" : "common.confirm"}
      confirmFn={() => {
        onClose();
        if (isRejected) router.push(editHref);
      }}
    />
  );
};

export default ContentReviewDialog;
