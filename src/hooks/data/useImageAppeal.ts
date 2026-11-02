"use client";

import { useTranslations } from "next-intl";
import { notifyApiError } from "@/api";
import { useImageAppealMutation } from "@/api/review/postImageAppeal";
import { showAppToast } from "@/lib/toast";

/** 이미지 이의 신청. 결과는 토스트로 알리고, 성공하면 onAppealed 로 그 파일을 알려 준다. */
export const useImageAppeal = (onAppealed?: (fileId: string) => void) => {
  const t = useTranslations("imageReview");
  const { mutate, isPending, variables } = useImageAppealMutation();

  const appeal = (fileId: string) =>
    mutate(fileId, {
      onSuccess: () => {
        showAppToast("success", t("appealSubmitted"));
        onAppealed?.(fileId);
      },
      onError: (error) => {
        if (error.status === 409) {
          showAppToast("warning", t("appealNotAllowed"));
          return;
        }
        if (error.status === 429) {
          showAppToast("warning", t("appealRateLimited"));
          return;
        }
        notifyApiError(error);
      },
    });

  return { appeal, pendingFileId: isPending ? variables : undefined };
};
