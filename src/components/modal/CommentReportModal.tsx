"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";
import { ModalLayout } from "../ModalLayout";
import { Close, Flag } from "@/icons";
import { useFeedbackReportMutation } from "@/api/feedback/postFeedbackReport";
import {
  commentReportFormSchema,
  CommentReportFormValues,
} from "@/schema/modal.schema";
import { CommentReportModalProps } from "@/type/modal";
import { focusFirstFieldError } from "@/lib/formError";
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
import { showAppToast } from "@/lib/toast";
import IconButton from "@/components/ui/IconButton";

const CommentReportModal = ({ onClose, commentId }: CommentReportModalProps) => {
  const t = useTranslations("modalUi.commentReport");
  const commonT = useTranslations("modalUi.common");
  const translateText = useTranslateText();
  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CommentReportFormValues>({
    resolver: zodResolver(commentReportFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const titleValue = useWatch({ control, name: "title" });
  const contentValue = useWatch({ control, name: "content" });
  const { mutate: reportFeedback, isPending } = useFeedbackReportMutation();

  const onSubmit = (data: CommentReportFormValues) => {
    if (isPending) return;

    reportFeedback(
      {
        type: "COMMENT",
        targetId: commentId,
        title: data.title,
        content: data.content,
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
      className="h-[695px] w-[450px] max-w-[calc(100vw-40px)] rounded-3xl border-0 bg-dark p-5"
    >
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) =>
          focusFirstFieldError(formErrors, setFocus, translateText),
        )}
        className="flex h-full flex-col"
      >
        <header className="flex items-center justify-between pb-7">
          <div className="flex items-center gap-3">
            <Flag className="size-6 text-font-1" aria-hidden="true" />
            <h2 className="title-1">{t("title")}</h2>
          </div>
          <IconButton size="xs" onClick={onClose} aria-label={commonT("close")}>
            <Close className="size-3.5" />
          </IconButton>
        </header>
        <div className="flex flex-col gap-7">
          <SmartInput
            {...register("title")}
            value={titleValue}
            label={t("titleLabel")}
            maxLength={200}
            placeholder={t("titlePlaceholder")}
            required
            error={errors.title}
            helperMessage=""
            className="flex-none"
          />
          <SmartInput
            {...register("content")}
            type="textarea"
            value={contentValue}
            label={t("contentLabel")}
            maxLength={2000}
            maxLine={18}
            minLine={18}
            placeholder={t("contentPlaceholder")}
            required
            error={errors.content}
            className="flex-none"
          />
        </div>
        <ActiveButton
          type="submit"
          isActive={Boolean(titleValue && contentValue) && !isPending}
          text={t("submit")}
          className="mt-auto h-[42px] rounded-xl"
        />
      </form>
    </ModalLayout>
  );
};

export default CommentReportModal;
