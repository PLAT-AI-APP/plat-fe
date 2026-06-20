"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import StatusWarning from "@/icons/StatusWarning";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import RepresentativeImage from "./RepresentativeImage";

const Profile = () => {
  const t = useTranslations("characterCreate.profile");
  const { register, control } = useFormContext<CharacterCreateFormValues>();
  const titleValue = useWatch({ control, name: "title" });
  const characterIntroduceValue = useWatch({
    control,
    name: "characterIntroduce",
  });

  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-5">
        <RepresentativeImage />

        {/* The policy notice visually separates image upload from the text fields. */}
        <div className="body-6 flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3 pl-3 pr-5 text-font-2">
          <StatusWarning className="size-3.5 shrink-0" />
          <p className="whitespace-nowrap">{t("policyNotice")}</p>
        </div>
      </div>

      <div id="character-basic-info" className="mt-6 flex flex-col gap-6">
        <SmartInput
          label={t("titleLabel")}
          required
          maxLength={20}
          placeholder={t("titlePlaceholder")}
          isBorder
          {...register("title")}
          value={titleValue}
          helperMessage=""
        />

        <SmartInput
          label={t("introduceLabel")}
          required
          maxLength={20}
          placeholder={t("introducePlaceholder")}
          isBorder
          {...register("characterIntroduce")}
          value={characterIntroduceValue}
          helperMessage=""
        />
      </div>
    </section>
  );
};

export default Profile;
