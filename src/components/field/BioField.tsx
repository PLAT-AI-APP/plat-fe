"use client";

import React from "react";
import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";
import SmartInput from "../SmartInput";

interface BioFieldProps<T extends FieldValues> {
  name?: Path<T>;
}

const BioField = <T extends FieldValues>({
  name = "bio" as Path<T>,
}: BioFieldProps<T>) => {
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
      label="소개글"
      value={bio as string}
      placeholder="소개글을 작성해주세요."
      maxLine={2}
      minLine={2}
      maxLength={50}
      error={error?.message as string}
    />
  );
};

export default BioField;
