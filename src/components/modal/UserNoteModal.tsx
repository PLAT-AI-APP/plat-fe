"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloseLine } from "@/icons";
import Note from "@/icons/Note";
import { ModalLayout } from "../ModalLayout";
import ActiveButton from "../ActiveButton";
import { UserNoteModalProps } from "@/type/modal";
import { userNoteFormSchema, UserNoteFormValues } from "@/schema/modal.schema";

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
      className="top-1/2 left-1/2 h-fit w-[450px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-5"
    >
      <form
        className="flex w-full flex-col items-end gap-9"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="flex w-full flex-col gap-6">
          <header className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Note className="h-6 w-6 text-font-1" />
                <h2 className="title-1 text-font-1">{t("title")}</h2>
              </div>
              <button
                onClick={onClose}
                type="button"
                aria-label={commonT("close")}
                className="flex size-5.5 items-center justify-center rounded-lg p-1 text-font-1 hover:bg-btn-hover"
              >
                <CloseLine className="size-3.5" />
              </button>
            </div>
            <p className="body-4 text-font-2">{t("description")}</p>
          </header>

          <div className="flex w-full flex-col items-end rounded-2xl border border-main bg-card px-4 py-3 transition-colors focus-within:field-focus!">
            <textarea
              {...register("userNote")}
              value={noteValue}
              maxLength={500}
              rows={6}
              placeholder={t("placeholder")}
              className="focus-ring-none body-4 custom-scrollbar min-h-31.5 max-h-52.5 w-full resize-none overflow-y-auto bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
              aria-invalid={Boolean(errors.userNote)}
            />
            <p className="body-6 w-full text-right text-font-2">
              {(noteValue ?? "").length}/500
            </p>
          </div>
        </section>

        <ActiveButton
          type="submit"
          isActive={Boolean(noteValue?.trim())}
          text={commonT("save")}
          className="h-11 w-25 rounded-xl"
        />
      </form>
    </ModalLayout>
  );
};

export default UserNoteModal;
