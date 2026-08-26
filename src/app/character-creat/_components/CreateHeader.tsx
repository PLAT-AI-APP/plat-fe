"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import ArrowLineLeft from "@/icons/ArrowLineLeft";
import { Redo } from "@/icons";
import { useChatacterCreateMutation } from "@/api/character/postChatacterCreate";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { showAppToast } from "@/lib/toast";

interface CreateHeaderProps {
  onSave: () => void;
  onDraftClick: () => void;
}

const CreateHeader = ({ onSave, onDraftClick }: CreateHeaderProps) => {
  const t = useTranslations("characterCreate");
  const router = useRouter();
  const {
    formState: { isValid },
    getValues,
  } = useFormContext<CharacterCreateFormValues>();
  const { mutate, isPending } = useChatacterCreateMutation();

  const handleSafeBack = (fallbackPath = "/") => {
    if (window.history.state.__next_navigation_guard_stack_index > 0) {
      router.back();
      return;
    }

    router.push(fallbackPath);
  };

  const handleRegisterClick = () => {
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
          imageId: asset.assetImageId,
          visibility: asset.assetVisibility,
        })) || [],
      visibility: currentFormData.isPublic ? "PUBLIC" : "PRIVATE",
      allowComments: currentFormData.allowComments,
      // 프로필 탭의 프롤로그 소개가 있으면 우선 보내고, 없을 때는 상세 설명을 사용합니다.
      description:
        currentFormData.profileSituationDescription ||
        currentFormData.characterDescription,
      tendency: currentFormData.tendency,
      category: currentFormData.category,
      tagIds: currentFormData.tagIds.map((tag) => tag.id),
    };

    mutate(
      { props: payload },
      {
        onSuccess: () => {
          showAppToast("success", t("createSuccess"), { size: "s" });
          router.push("/");
        },
        onError: (error) => {
          // 실패 토스트는 axios 인터셉터 → MutationCache의 전역 에러 처리에서 이미 띄우므로 여기서 중복으로 띄우지 않습니다.
          console.error("Character create failed:", error);
        },
      },
    );
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
          text={isPending ? t("submitting") : t("submit")}
          className="h-9 rounded-xl px-4 py-2"
          onClick={handleRegisterClick}
        />
      </div>
    </header>
  );
};

export default CreateHeader;
