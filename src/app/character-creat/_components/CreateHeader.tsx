"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import ArrowLineLeft from "@/icons/ArrowLineLeft";
import { Redo } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { showAppToast } from "@/lib/toast";

interface CreateHeaderProps {
  onSave: () => void;
  onDraftClick: () => void;
}

const CreateHeader = ({ onSave, onDraftClick }: CreateHeaderProps) => {
  const t = useTranslations("characterCreate");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formState: { isValid },
    getValues,
  } = useFormContext<CharacterCreateFormValues>();

  const handleSafeBack = (fallbackPath = "/") => {
    if (window.history.state.__next_navigation_guard_stack_index > 0) {
      router.back();
      return;
    }

    router.push(fallbackPath);
  };

  const handleRegisterClick = () => {
    if (isSubmitting) return;

    void isValid;

    const currentFormData = getValues();
    const payload = {
      representativeImageId: currentFormData.representativeImageId,
      profileImageId: currentFormData.characterProfileImageId,
      name: currentFormData.name,
      introduce: currentFormData.characterIntroduce,
      detailSetting: currentFormData.characterDetailSetting,
      assets:
        currentFormData.asset?.map((asset) => ({
          name: asset.assetName,
          situation: asset.assetSituation,
          assetImageFileId: asset.assetImageFileId,
          visibility: asset.assetVisibility,
        })) || [],
      visibility: currentFormData.isPublic ? "PUBLIC" : "PRIVATE",
      allowComments: currentFormData.allowComments,
      description:
        currentFormData.profileSituationDescription ||
        currentFormData.characterDescription,
      tendency: currentFormData.tendency,
      category: currentFormData.category,
      tagIds: currentFormData.tagIds.map((tag) => tag.id),
    };

    setIsSubmitting(true);
    console.info("Character create API is disabled. Local payload:", payload);
    showAppToast("success", t("createSuccess"));
    router.push("/");
    setIsSubmitting(false);
  };

  return (
    <header className="flex h-[37px] shrink-0 items-center justify-between">
      <h2 className="title-1 flex items-center gap-2">
        <ArrowLineLeft
          onClick={() => handleSafeBack("/")}
          className="h-6 w-6 cursor-pointer text-font-2"
        />
        {t("headerTitle")}
      </h2>

      <div className="body-4 flex gap-4 whitespace-nowrap">
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="rounded-xl border border-main bg-card px-5 py-2 hover:bg-card-hover"
          >
            {t("temporarySave")}
          </button>
          <button
            onClick={onDraftClick}
            className="flex aspect-square h-full items-center justify-center rounded-xl border border-main bg-card p-2 hover:bg-card-hover"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        <ActiveButton
          isActive
          text={isSubmitting ? t("submitting") : t("submit")}
          className="h-9 rounded-xl px-4 py-2"
          onClick={handleRegisterClick}
        />
      </div>
    </header>
  );
};

export default CreateHeader;
