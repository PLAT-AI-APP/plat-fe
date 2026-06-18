"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalLayout } from "../ModalLayout";
import { Close, Storage } from "@/icons";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";
import { StorageModalProps } from "@/type/modal";
import { storageFormSchema, StorageFormValues } from "@/schema/modal.schema";

const StorageModal = ({ onClose }: StorageModalProps) => {
  const t = useTranslations("modalUi.storage");
  const commonT = useTranslations("modalUi.common");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StorageFormValues>({
    resolver: zodResolver(storageFormSchema),
    defaultValues: {
      longTermMemory: "",
    },
  });

  const memoryValue = useWatch({ control, name: "longTermMemory" });

  const onSubmit = () => {
    onClose();
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="top-1/2 left-1/2 h-fit w-screen max-w-125 -translate-x-1/2 -translate-y-1/2 p-5"
    >
      <header className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Storage className="h-6 w-6" />
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

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <SmartInput
          {...register("longTermMemory")}
          value={memoryValue}
          maxLength={2000}
          maxLine={12}
          minLine={12}
          type="textarea"
          isBorder={false}
          inputClassName="bg-card"
          inputBoxClassName="bg-card"
          placeholder={t("placeholder")}
          error={errors.longTermMemory}
        />

        <div className="mt-9 flex justify-end">
          <ActiveButton
            type="submit"
            isActive={Boolean(memoryValue?.trim())}
            text={commonT("save")}
            className="w-25 rounded-xl"
          />
        </div>
      </form>
    </ModalLayout>
  );
};

export default StorageModal;
