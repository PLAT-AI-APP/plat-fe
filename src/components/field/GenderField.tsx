"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

const GenderField = () => {
  const { setValue, control } = useFormContext();
  const gender = useWatch({ control, name: "gender" });

  return (
    <div className={cn("flex flex-col flex-1 gap-2 w-full")}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 font-medium text-sm">
          <span>성별</span>
          <span className="text-font-accents">*</span>
        </div>
      </div>

      <div className="flex gap-2 text-sm">
        {(["MALE", "FEMALE"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() =>
              setValue("gemder", g, {
                shouldValidate: true,
              })
            }
            className={cn(
              "flex-1 bg-bg-darkest border border-border-main rounded-xl py-3 transition-colors",
              gender === g && "text-brand font-medium bg-brand-opacity",
            )}
          >
            {g === "MALE" ? "남자" : "여자"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenderField;
