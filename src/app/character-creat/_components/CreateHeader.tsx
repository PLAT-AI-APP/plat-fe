"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import ArrowLineLeft from "@/icons/ArrowLineLeft";
import { Redo } from "@/icons";
import { dataUrlToFile } from "@/lib/file";
import { showAppToast } from "@/lib/toast";
import { useLocaleStore } from "@/store/useLocaleStore";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import {
  UniverseCreateCategory,
  UniverseCreateLanguage,
  UniverseCreateTendency,
  useUniverseCreateMutation,
} from "@/api/universe/postUniverseCreate";

interface CreateHeaderProps {
  onSave: () => void;
  onDraftClick: () => void;
}

const UNIVERSE_TENDENCIES: UniverseCreateTendency[] = [
  "ALL",
  "MALE",
  "FEMALE",
];

const UNIVERSE_CATEGORIES: UniverseCreateCategory[] = [
  "SIMULATION",
  "ROMANCE",
  "FANTASY",
  "DRAMA",
  "MARTIAL_ARTS_HISTORICAL",
  "GL",
  "BL",
  "HORROR_MYSTERY",
  "ACTION",
  "COMIC_DAILY",
  "SPORTS_SCHOOL",
  "ETC",
];

const LANGUAGE_BY_LOCALE: Record<string, UniverseCreateLanguage> = {
  ko: "KO",
  en: "EN",
  ja: "JA",
  zh: "ZH",
  th: "TH",
  vi: "VI",
};

const getDataUrlMimeType = (dataUrl: string) =>
  dataUrl.match(/^data:(.*?);/)?.[1] || "image/webp";

const createImageFileFromDataUrl = (
  dataUrl: string,
  fileNamePrefix: string,
) => {
  const mimeType = getDataUrlMimeType(dataUrl);
  const extension = mimeType.split("/")[1] || "webp";

  return dataUrlToFile(dataUrl, `${fileNamePrefix}.${extension}`, mimeType);
};

const serializeScenarioContent = (
  scenario: CharacterCreateFormValues["scenarios"][number],
) =>
  [
    scenario.description,
    scenario.difficulty,
    ...(scenario.contents ?? []).map((content) => content.value),
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join("\n\n");

const toUniverseTendency = (tendency: string): UniverseCreateTendency => {
  if (UNIVERSE_TENDENCIES.includes(tendency as UniverseCreateTendency)) {
    return tendency as UniverseCreateTendency;
  }

  return "ALL";
};

const toUniverseCategory = (categories: string[]): UniverseCreateCategory => {
  const category = categories[0];

  if (UNIVERSE_CATEGORIES.includes(category as UniverseCreateCategory)) {
    return category as UniverseCreateCategory;
  }

  return "ETC";
};

const isApiErrorLike = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error;

const CreateHeader = ({ onSave, onDraftClick }: CreateHeaderProps) => {
  const t = useTranslations("characterCreate");
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const { getValues, trigger } = useFormContext<CharacterCreateFormValues>();
  const { mutateAsync: createUniverse, isPending } = useUniverseCreateMutation();

  const handleSafeBack = (fallbackPath = "/") => {
    if (window.history.state.__next_navigation_guard_stack_index > 0) {
      router.back();
      return;
    }

    router.push(fallbackPath);
  };

  const handleRegisterClick = async () => {
    if (isPending) return;

    const isFormValid = await trigger();
    if (!isFormValid) return;

    const currentFormData = getValues();

    try {
      const [profileImage, characterProfileImage] = await Promise.all([
        createImageFileFromDataUrl(
          currentFormData.representativeImage,
          "universe-profile-image",
        ),
        createImageFileFromDataUrl(
          currentFormData.characterProfileImage,
          "character-profile-image",
        ),
      ]);

      const created = await createUniverse({
        request: {
          commentEnabled: currentFormData.allowComments,
          scenarios: currentFormData.scenarios.map((scenario, index) => ({
            name: scenario.name || `Scenario ${index + 1}`,
            content: serializeScenarioContent(scenario),
          })),
          assets:
            currentFormData.asset
              ?.filter((asset) => asset.assetImageFileId)
              .map((asset) => ({
                assetImageFileId: String(asset.assetImageFileId),
                assetName: asset.assetName,
                assetSituation: asset.assetSituation,
              })) || [],
          tendency: toUniverseTendency(currentFormData.tendency),
          name: currentFormData.name,
          visibility: currentFormData.isPublic ? "PUBLIC" : "PRIVATE",
          title: currentFormData.title,
          language: LANGUAGE_BY_LOCALE[locale] ?? "KO",
          description:
            currentFormData.characterDescription ||
            currentFormData.profileSituationDescription,
          tagIds: currentFormData.tagIds.map((tag) => tag.id),
          category: toUniverseCategory(currentFormData.category),
          detailSetting: currentFormData.characterDetailSetting,
          introduce: currentFormData.characterIntroduce,
        },
        profileImage,
        characterProfileImage,
      });

      showAppToast("success", t("createSuccess"));
      router.push(`/characters/${created.universeId}`);
    } catch (error) {
      if (!isApiErrorLike(error)) {
        showAppToast("error", t("createFailed"));
      }
      console.error("Universe create failed:", error);
    }
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
