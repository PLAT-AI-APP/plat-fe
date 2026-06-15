"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";
import { ModalLayout } from "../ModalLayout";
import { Close, Megaphone } from "@/icons";
import { useHashtagSuggestMutation } from "@/api/hashtag/postHashtagSuggest";
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
  const { mutate: hashtagSuggest } = useHashtagSuggestMutation();

  const onSubmit = (data: TagSuggestionFormValues) => {
    const { name, opinion } = data;
    hashtagSuggest({ name, opinion });
    onClose();
  };

  return (
    <ModalLayout onClose={onClose} hasBackground className="w-112.5 p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <Megaphone aria-hidden="true" />
            <h2 className="title-1">{t("title")}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")}>
            <Close className="h-3.5 w-3.5 cursor-pointer" />
          </button>
        </header>
        <div className="flex flex-col gap-6">
          <SmartInput
            {...register("name")}
            value={nameValue}
            label={t("nameLabel")}
            maxLength={10}
            placeholder={t("namePlaceholder")}
            required
            error={errors.name}
          />
          <SmartInput
            {...register("opinion")}
            type="textarea"
            value={opinionValue}
            label={t("opinionLabel")}
            maxLength={200}
            maxLine={10}
            minLine={10}
            placeholder={t("opinionPlaceholder")}
            required
            error={errors.opinion}
          />
        </div>
        <ActiveButton
          type="submit"
          isActive={Boolean(opinionValue && nameValue)}
          text={t("submit")}
          className="mt-6.5 rounded-xl"
        />
      </form>
    </ModalLayout>
  );
};

export default TagSuggestionsModal;
