"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";

interface BioFieldProps<T extends FieldValues> {
  name?: Path<T>;
}

const BioField = <T extends FieldValues>({
  name = "bio" as Path<T>,
}: BioFieldProps<T>) => {
  const t = useTranslations();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<T>();

  const bio = useWatch({ control, name });
  const error = errors[name];

  return (
    <SmartInput
      {...register(name)}
      type="textarea"
      label={t("fieldsExtra.bioLabel")}
      value={bio as string}
      placeholder={t("fieldsExtra.bioPlaceholder")}
      maxLine={2}
      minLine={2}
      maxLength={100}
      error={error ? "" : undefined}
      labelFontSize="title-5"
    />
  );
};

export default BioField;
