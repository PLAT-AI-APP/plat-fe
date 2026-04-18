"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { UserDetailFormValues } from "@/type/auth";
import { cn } from "@/lib/utils";

const GenderField = () => {
  const { setValue, watch } = useFormContext<UserDetailFormValues>();
  const gender = watch("gender");

  return (
    <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
      <legend className="text-sm text-font-1 mb-2">성별</legend>
      <div className="flex gap-2">
        {(["MALE", "FEMALE"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setValue("gender", g, { shouldValidate: true })}
            className={cn(
              "flex-1 h-11.5 rounded-lg border border-white/10 transition-all text-sm",
              gender === g
                ? "bg-brand-opacity text-brand border-brand/20"
                : "bg-black/20 text-font-2 hover:bg-black/30",
            )}
          >
            {g === "MALE" ? "남자" : "여자"}
          </button>
        ))}
      </div>
    </fieldset>
  );
};

export default GenderField;
