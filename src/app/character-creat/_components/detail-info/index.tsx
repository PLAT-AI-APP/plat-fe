"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { CharacterCreateFormValues } from "@/schema/character.schema";

const DetailInfo = () => {
  const detailT = useTranslations("characterCreate.details");
  const { register, control } = useFormContext<CharacterCreateFormValues>();
  const nameValue = useWatch({
    control,
    name: "name",
  });
  const characterDescriptionValue = useWatch({
    control,
    name: "characterDescription",
  });
  const characterDetailSetting = useWatch({
    control,
    name: "characterDetailSetting",
  });

  return (
    <section className="flex flex-col gap-8">
      <SmartInput
        label={detailT("nameLabel")}
        required
        maxLength={20}
        placeholder={detailT("namePlaceholder")}
        placeholderClassName="placeholder:text-font-2"
        counterClassName="text-font-disabled"
        isBorder
        {...register("name")}
        value={nameValue}
        helperMessage=""
      />

      <SmartInput
        label={detailT("descriptionLabel")}
        required
        maxLength={1000}
        placeholder={detailT("descriptionPlaceholder")}
        placeholderClassName="placeholder:text-font-2"
        counterClassName="text-font-disabled"
        type="textarea"
        minLine={3}
        maxLine={3}
        isBorder
        inputBoxClassName="h-[108px]"
        {...register("characterDescription")}
        value={characterDescriptionValue}
        helperMessage=""
      />

      <SmartInput
        label={detailT("settingLabel")}
        required
        maxLength={2000}
        placeholder={detailT("settingPlaceholder")}
        placeholderClassName="placeholder:text-font-2"
        counterClassName="text-font-disabled"
        type="textarea"
        minLine={12}
        maxLine={12}
        isBorder
        inputBoxClassName="h-[277px]"
        {...register("characterDetailSetting")}
        value={characterDetailSetting}
        helperMessage=""
      />
    </section>
  );
};

export default DetailInfo;
