"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";
import { ModalLayout } from "../ModalLayout";
import { Close, Megaphone } from "@/icons";
import { useFeedbackReportMutation } from "@/api/feedback/postFeedbackReport";
import {
  tagSuggestionFormSchema,
  TagSuggestionFormValues,
} from "@/schema/modal.schema";
import { TagSuggestionsModalProps } from "@/type/modal";

const TagSuggestionsModal = ({ onClose }: TagSuggestionsModalProps) => {
  const t = useTranslations("characterCreate.tagSuggestion");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TagSuggestionFormValues>({
    resolver: zodResolver(tagSuggestionFormSchema),
    defaultValues: {
      name: "",
      opinion: "",
    },
  });
  const nameValue = useWatch({ control, name: "name" });
  const opinionValue = useWatch({ control, name: "opinion" });
  const { mutate: reportFeedback } = useFeedbackReportMutation();

  const onSubmit = (data: TagSuggestionFormValues) => {
    const { name, opinion } = data;
    // 해시태그 제안은 범용 피드백 API의 HASHTAG 타입으로 전송
    reportFeedback({
      type: "HASHTAG",
      targetId: "",
      title: name,
      content: opinion,
    });
    onClose();
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="h-[695px] w-[450px] max-w-[calc(100vw-40px)] rounded-3xl border-0 bg-dark p-5"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
        <header className="flex items-center justify-between pb-7">
          <div className="flex items-center gap-3">
            <Megaphone className="size-6 text-font-1" aria-hidden="true" />
            <h2 className="title-1">{t("title")}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex size-5.5 items-center justify-center rounded-lg transition-none hover:bg-btn-hover"
            style={{ transition: "none", animation: "none" }}
          >
            <Close className="h-3.5 w-3.5 cursor-pointer" />
          </button>
        </header>
        <div className="flex flex-col gap-7">
          <SmartInput
            {...register("name")}
            value={nameValue}
            label={t("nameLabel")}
            maxLength={10}
            placeholder={t("namePlaceholder")}
            required
            error={errors.name}
            helperMessage=""
            className="flex-none"
          />
          <SmartInput
            {...register("opinion")}
            type="textarea"
            value={opinionValue}
            label={t("opinionLabel")}
            maxLength={200}
            maxLine={18}
            minLine={18}
            placeholder={t("opinionPlaceholder")}
            required
            error={errors.opinion}
            inputBoxClassName="h-[400px]"
            className="flex-none"
          />
        </div>
        <ActiveButton
          type="submit"
          isActive={Boolean(opinionValue && nameValue)}
          text={t("submit")}
          className="mt-auto h-[42px] rounded-xl transition-none"
          style={{ transition: "none", animation: "none" }}
        />
      </form>
    </ModalLayout>
  );
};

export default TagSuggestionsModal;
