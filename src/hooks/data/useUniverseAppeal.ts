"use client";

import { useTranslations } from "next-intl";
import { notifyApiError } from "@/api";
import { useUniverseAppealMutation } from "@/api/review/postUniverseAppeal";
import { showAppToast } from "@/lib/toast";

/** 세계관 본문 이의 신청. 결과는 토스트로 알리고, 성공하면 onAppealed 를 부른다. */
export const useUniverseAppeal = (onAppealed?: () => void) => {
  const t = useTranslations("dialog.contentReview");
  const imageT = useTranslations("imageReview");
  const { mutate, isPending } = useUniverseAppealMutation();

  const appeal = (universeId: string) =>
    mutate(universeId, {
      onSuccess: () => {
        // 접수 문구는 이미지 이의 신청과 같다(운영자가 확인한다는 안내).
        showAppToast("success", imageT("appealSubmitted"));
        onAppealed?.();
      },
      onError: (error) => {
        if (error.status === 409) {
          showAppToast("warning", t("appealBodyNotAllowed"));
          return;
        }
        if (error.status === 429) {
          showAppToast("warning", imageT("appealRateLimited"));
          return;
        }
        notifyApiError(error);
      },
    });

  return { appeal, isPending };
};
