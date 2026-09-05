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
  const profileSituationDescriptionValue = useWatch({
    control,
    name: "profileSituationDescription",
  });

  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-5">
        <RepresentativeImage />

        <div className="body-7 flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3 pl-3 pr-5 text-font-2">
          <StatusWarning className="size-3.5 shrink-0" />
          <p>{t("policyNotice")}</p>
        </div>
      </div>

      <div id="character-basic-info" className="mt-6 flex flex-col gap-6">
        <SmartInput
          label={t("titleLabel")}
          required
          maxLength={20}
          placeholder={t("titlePlaceholder")}
          placeholderClassName="placeholder:text-font-2"
          counterClassName="text-font-disabled"
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
          placeholderClassName="placeholder:text-font-2"
          counterClassName="text-font-disabled"
          isBorder
          {...register("characterIntroduce")}
          value={characterIntroduceValue}
          helperMessage=""
        />

        <SmartInput
          label={t("situationLabel")}
          maxLength={2000}
          placeholder={t("situationPlaceholder")}
          placeholderClassName="placeholder:text-font-2"
          counterClassName="text-font-disabled"
          type="textarea"
          minLine={8}
          maxLine={8}
          isBorder
          inputBoxClassName="h-[180px]"
          {...register("profileSituationDescription")}
          value={profileSituationDescriptionValue}
          helperMessage=""
        />
      </div>
    </section>
  );
};

export default Profile;
