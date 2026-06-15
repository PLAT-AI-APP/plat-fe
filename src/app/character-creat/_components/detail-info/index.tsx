"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { CharacterCreateFormValues } from "@/schema/character.schema";

const DetailInfo = () => {
  const t = useTranslations("characterCreate.details");
  const { register, control } = useFormContext<CharacterCreateFormValues>();
  const characterDetailSetting = useWatch({
    control,
    name: "characterDetailSetting",
  });

  return (
    <section className="flex flex-col gap-6">
      <article>
        <SmartInput
          label={t("label")}
          maxLength={2000}
          type="textarea"
          description={t("description")}
          required
          maxLine={15}
          minLine={15}
          isBorder
          {...register("characterDetailSetting")}
          value={characterDetailSetting}
        />
      </article>
    </section>
  );
};

export default DetailInfo;
