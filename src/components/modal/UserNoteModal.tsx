"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SmartInput from "@/components/smart-input";
import { Close } from "@/icons";
import Note from "@/icons/Note";
import { ModalLayout } from "../ModalLayout";
import ActiveButton from "../ActiveButton";
import { UserNoteModalProps } from "@/type/modal";
import {
  userNoteFormSchema,
  UserNoteFormValues,
} from "@/schema/modal.schema";

const UserNoteModal = ({ onClose }: UserNoteModalProps) => {
  const t = useTranslations("modalUi.userNote");
  const commonT = useTranslations("modalUi.common");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserNoteFormValues>({
    resolver: zodResolver(userNoteFormSchema),
    defaultValues: {
      userNote: "",
    },
  });

  const noteValue = useWatch({ control, name: "userNote" });

  const onSubmit = () => {
    onClose();
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="top-1/2 left-1/2 h-fit w-screen max-w-112.5 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap p-5"
    >
      <header className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Note className="h-6 w-6" />
            <h2 className="title-1">{t("title")}</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label={commonT("close")}
            className="h-5.5 w-5.5 rounded-lg p-1 hover:bg-btn-hover"
          >
            <Close className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="body-4 pt-2 text-font-2">{t("description")}</p>
      </header>

      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <SmartInput
          {...register("userNote")}
          value={noteValue}
          maxLength={500}
          inputClassName="bg-card border-none"
          inputBoxClassName="bg-card"
          type="textarea"
          maxLine={10}
          minLine={6}
          isBorder={false}
          placeholder={t("placeholder")}
          error={errors.userNote}
        />
        <ActiveButton
          type="submit"
          isActive={Boolean(noteValue?.trim())}
          text={commonT("save")}
          className="mt-9 float-end w-25 rounded-xl"
        />
      </form>
    </ModalLayout>
  );
};

export default UserNoteModal;
