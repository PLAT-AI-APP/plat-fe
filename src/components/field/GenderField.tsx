"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

const GenderField = () => {
  const t = useTranslations();
  const { setValue, control } = useFormContext();
  const gender = useWatch({ control, name: "gender" });

  return (
    <div className="flex w-full flex-1 flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="title-5 flex items-center gap-1">
          <span>{t("fieldsExtra.genderLabel")}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {(["MALE", "FEMALE"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() =>
              setValue("gender", g, {
                shouldValidate: true,
              })
            }
            className={cn(
              "body-4 flex-1 rounded-xl bg-card py-3 transition-colors",
              gender === g && "title-5 bg-brand/10 text-brand",
            )}
          >
            {g === "MALE"
              ? t("fieldsExtra.male")
              : t("fieldsExtra.female")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenderField;
