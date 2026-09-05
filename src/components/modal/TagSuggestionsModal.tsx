"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";
import { ModalLayout } from "../ModalLayout";
import { Close, Megaphone } from "@/icons";
import { useFeedbackSuggestMutation } from "@/api/feedback/postFeedbackSuggest";
import {
  tagSuggestionFormSchema,
  TagSuggestionFormValues,
} from "@/schema/modal.schema";
import { TagSuggestionsModalProps } from "@/type/modal";
import { showFirstFieldErrorToast } from "@/lib/formError";
import { useTranslateText } from "@/hooks/useTranslateText";
import IconButton from "@/components/ui/IconButton";

const TagSuggestionsModal = ({ onClose }: TagSuggestionsModalProps) => {
  const t = useTranslations("characterCreate.tagSuggestion");
  const translateText = useTranslateText();
  const {
    register,
    control,
    handleSubmit,
    setFocus,
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
  const { mutate: suggestFeedback } = useFeedbackSuggestMutation();

  const onSubmit = (data: TagSuggestionFormValues) => {
    const { name, opinion } = data;
    // 해시태그 제안은 기존 대상이 없는 신규 건의라 report가 아니라 suggest API를 사용합니다.
    // (report의 targetId는 신고 대상 ID용이라 빈 값이면 백엔드가 항상 거부합니다.)
    suggestFeedback({
      type: "HASHTAG",
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
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) =>
          showFirstFieldErrorToast(formErrors, setFocus, translateText),
        )}
        className="flex h-full flex-col"
      >
        <header className="flex items-center justify-between pb-7">
          <div className="flex items-center gap-3">
            <Megaphone className="size-6 text-font-1" aria-hidden="true" />
            <h2 className="title-1">{t("title")}</h2>
          </div>
          <IconButton size="xs" onClick={onClose} aria-label={t("close")}>
            <Close className="size-3.5" />
          </IconButton>
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
          className="mt-auto h-[42px] rounded-xl"
        />
      </form>
    </ModalLayout>
  );
};

export default TagSuggestionsModal;
