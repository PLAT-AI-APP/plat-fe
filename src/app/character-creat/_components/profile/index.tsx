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
  const nameValue = useWatch({ control, name: "name" });
  const characterIntroduceValue = useWatch({
    control,
    name: "characterIntroduce",
  });

  return (
    <section className="flex flex-col gap-6">
      <RepresentativeImage />

      <div id="character-basic-info" className="flex flex-col gap-6">
        <SmartInput
          label={t("titleLabel")}
          required
          maxLength={20}
          placeholder={t("titlePlaceholder")}
          isBorder
          {...register("title")}
          value={titleValue}
        />

        <SmartInput
          label={t("nameLabel")}
          required
          maxLength={20}
          placeholder={t("namePlaceholder")}
          isBorder
          {...register("name")}
          value={nameValue}
        />

        <SmartInput
          label={t("introduceLabel")}
          required
          maxLength={30}
          placeholder={t("introducePlaceholder")}
          type="textarea"
          maxLine={3}
          minLine={3}
          isBorder
          {...register("characterIntroduce")}
          value={characterIntroduceValue}
        />
      </div>

      <footer className="body-6 flex items-center gap-2 rounded-xl bg-card p-3 pr-5 text-font-2">
        <StatusWarning className="h-5 w-5" />
        <p>{t("policyNotice")}</p>
      </footer>
    </section>
  );
};

export default Profile;
