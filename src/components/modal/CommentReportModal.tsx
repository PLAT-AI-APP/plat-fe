"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalLayout } from "../ModalLayout";
import { useFeedbackReportMutation } from "@/api/feedback/postFeedbackReport";
import {
  COMMENT_REPORT_CONTENT_MAX_LENGTH,
  commentReportFormSchema,
  CommentReportFormValues,
} from "@/schema/modal.schema";
import { CommentReportModalProps } from "@/type/modal";
import { focusFirstFieldError } from "@/lib/formError";
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
import { showAppToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/** 서버 신고 제목 상한(200자). 디자인에 제목 입력이 없어 사유 앞부분을 제목으로 쓴다. */
const REPORT_TITLE_MAX_LENGTH = 50;

const CommentReportModal = ({
  onClose,
  commentId,
  nickname,
}: CommentReportModalProps) => {
  const t = useTranslations("modalUi.commentReport");
  const commonT = useTranslations("common");
  const translateText = useTranslateText();
  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CommentReportFormValues>({
    resolver: zodResolver(commentReportFormSchema),
    defaultValues: { content: "" },
  });
  const contentValue = useWatch({ control, name: "content" });
  const { mutate: reportFeedback, isPending } = useFeedbackReportMutation();
  const hasContent = contentValue.trim().length > 0;

  const onSubmit = (data: CommentReportFormValues) => {
    if (isPending) return;

    reportFeedback(
      {
        type: "COMMENT",
        targetId: commentId,
        // 서버는 제목이 필수(DB not null)라, 사유의 앞부분을 목록에서 알아볼 제목으로 쓴다.
        title: data.content.trim().slice(0, REPORT_TITLE_MAX_LENGTH),
        content: data.content.trim(),
      },
      {
        onSuccess: () => {
          showAppToast("success", t("successToast"));
          onClose();
        },
      },
    );
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-[473px] max-w-[calc(100vw-40px)] overflow-hidden rounded-3xl bg-dark px-6 pb-6 pt-8"
    >
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) =>
          focusFirstFieldError(formErrors, setFocus, translateText),
        )}
        className="flex w-full flex-col gap-9"
      >
        <div className="flex w-full flex-col gap-5">
          <h2 className="title-2 w-full text-font-1">
            {t("title", { nickname })}
          </h2>

          <div className="flex flex-col gap-1.5">
            <div
              className={cn(
                "flex flex-col gap-1 rounded-xl border border-main bg-darkest px-4 py-3 transition-colors focus-within:field-focus!",
                errors.content && "border-font-error",
              )}
            >
              <textarea
                {...register("content")}
                rows={4}
                maxLength={COMMENT_REPORT_CONTENT_MAX_LENGTH}
                placeholder={t("placeholder")}
                aria-label={t("title", { nickname })}
                aria-invalid={Boolean(errors.content)}
                className="focus-ring-none body-5 custom-scrollbar w-full resize-none bg-transparent text-font-1 outline-none placeholder:text-font-2"
              />
              <p className="body-6 text-right text-font-disabled">
                {contentValue.length}/{COMMENT_REPORT_CONTENT_MAX_LENGTH}
              </p>
            </div>

            {errors.content?.message && (
              <p role="alert" className="body-6 text-font-error">
                {translateText(errors.content.message)}
              </p>
            )}
          </div>
        </div>

        <div className="title-5 flex w-full items-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[42px] flex-1 items-center justify-center rounded-xl bg-card px-6 text-font-1 transition-colors hover:bg-card-hover"
          >
            {commonT("cancel")}
          </button>

          <button
            type="submit"
            disabled={!hasContent || isPending}
            className="flex h-[42px] flex-1 items-center justify-center rounded-xl bg-brand px-6 text-on-brand transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:bg-card disabled:text-font-disabled"
          >
            {t("submit")}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default CommentReportModal;
