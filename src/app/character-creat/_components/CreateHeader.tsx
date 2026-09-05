"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FieldErrors, FieldPath, useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import ArrowLineLeft from "@/icons/ArrowLineLeft";
import { Redo } from "@/icons";
import { showAppToast } from "@/lib/toast";
import { useLocaleStore } from "@/store/useLocaleStore";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import {
  UniverseCreateCategory,
  UniverseCreateLanguage,
  UniverseCreateRequest,
  UniverseCreateTendency,
  useUniverseCreateMutation,
} from "@/api/universe/postUniverseCreate";
import {
  UniverseUpdateRequest,
  useUniverseUpdateMutation,
} from "@/api/universe/patchUniverseUpdate";
import { useTranslateText } from "@/hooks/useTranslateText";
import { TabId } from "./CreateTabs";

interface CreateHeaderProps {
  universeId?: string;
  onSave: () => void;
  onDraftClick: () => void;
  setCurrentTabId: (id: TabId) => void;
  setActiveScenarioIndex: (index: number) => void;
  markSubmitSuccess: () => void;
}

/**
 * 등록 실패 시 이동할 탭/시나리오와, 가능하면 바로 포커스할 필드를 담습니다.
 * fieldPath는 RHF에 register()된 input(setFocus)용, focusElementId는 이미지
 * 업로드처럼 register() 없이 값만 들어가는 요소를 id로 직접 focus()할 때 씁니다.
 */
interface ValidationJumpTarget {
  tabId: TabId;
  scenarioIndex?: number;
  fieldPath?: FieldPath<CharacterCreateFormValues>;
  focusElementId?: string;
  message: string;
}

const UNIVERSE_TENDENCIES: UniverseCreateTendency[] = [
  "ALL",
  "MALE_ORIENTED",
  "FEMALE_ORIENTED",
];

const UNIVERSE_CATEGORIES: UniverseCreateCategory[] = [
  "ROMANCE",
  "FANTASY",
  "DRAMA",
  "MARTIAL_ARTS",
  "GL",
  "BL",
  "HORROR",
  "MYSTERY",
];

const LANGUAGE_BY_LOCALE: Record<string, UniverseCreateLanguage> = {
  ko: "KO",
  en: "EN",
  ja: "JA",
  zh: "ZH",
  th: "TH",
  vi: "VI",
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

  return "ROMANCE";
};

const isApiErrorLike = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error;

/**
 * 탭 순서(profile → details → assets → scenario → settings)와 각 탭 안의
 * 입력 순서를 기준으로 가장 먼저 걸리는 에러를 찾습니다.
 * 대표/프로필 이미지, 성향/카테고리, 시나리오 대화 콘텐츠는 실제 등록된
 * input이 아니라(버튼 선택이거나, 시나리오 프리뷰에서 편집모드로 들어가야
 * 나타나는 textarea) 포커스는 불가능해 탭 이동 + 토스트로만 안내합니다.
 */
const findFirstValidationTarget = (
  errors: FieldErrors<CharacterCreateFormValues>,
  values: CharacterCreateFormValues,
): ValidationJumpTarget | null => {
  if (errors.representativeImage) {
    return {
      tabId: "profile",
      focusElementId: "representative-image-field",
      message: errors.representativeImage.message ?? "",
    };
  }
  if (errors.title) {
    return {
      tabId: "profile",
      fieldPath: "title",
      message: errors.title.message ?? "",
    };
  }
  if (errors.characterIntroduce) {
    return {
      tabId: "profile",
      fieldPath: "characterIntroduce",
      message: errors.characterIntroduce.message ?? "",
    };
  }
  if (errors.profileSituationDescription) {
    return {
      tabId: "profile",
      fieldPath: "profileSituationDescription",
      message: errors.profileSituationDescription.message ?? "",
    };
  }

  if (errors.characterProfileImage) {
    return {
      tabId: "details",
      focusElementId: "character-profile-image-field",
      message: errors.characterProfileImage.message ?? "",
    };
  }
  if (errors.name) {
    return {
      tabId: "details",
      fieldPath: "name",
      message: errors.name.message ?? "",
    };
  }
  if (errors.characterDescription) {
    return {
      tabId: "details",
      fieldPath: "characterDescription",
      message: errors.characterDescription.message ?? "",
    };
  }
  if (errors.characterDetailSetting) {
    return {
      tabId: "details",
      fieldPath: "characterDetailSetting",
      message: errors.characterDetailSetting.message ?? "",
    };
  }

  for (let i = 0; i < (values.asset?.length ?? 0); i += 1) {
    const assetError = errors.asset?.[i];
    if (assetError?.assetName) {
      return {
        tabId: "assets",
        fieldPath: `asset.${i}.assetName`,
        message: assetError.assetName.message ?? "",
      };
    }
    if (assetError?.assetSituation) {
      return {
        tabId: "assets",
        fieldPath: `asset.${i}.assetSituation`,
        message: assetError.assetSituation.message ?? "",
      };
    }
  }

  for (let i = 0; i < values.scenarios.length; i += 1) {
    const scenarioError = errors.scenarios?.[i];
    if (scenarioError?.name) {
      return {
        tabId: "scenario",
        scenarioIndex: i,
        fieldPath: `scenarios.${i}.name`,
        message: scenarioError.name.message ?? "",
      };
    }

    const contents = values.scenarios[i].contents ?? [];
    for (let j = 0; j < contents.length; j += 1) {
      if (scenarioError?.contents?.[j]?.value) {
        return {
          tabId: "scenario",
          scenarioIndex: i,
          message: scenarioError.contents[j]?.value?.message ?? "",
        };
      }
    }
  }

  if (errors.tendency) {
    return { tabId: "settings", message: errors.tendency.message ?? "" };
  }
  if (errors.category) {
    return { tabId: "settings", message: errors.category.message ?? "" };
  }
  if (errors.tagIds) {
    return { tabId: "settings", message: errors.tagIds.message ?? "" };
  }

  return null;
};

const CreateHeader = ({
  universeId,
  onSave,
  onDraftClick,
  setCurrentTabId,
  setActiveScenarioIndex,
  markSubmitSuccess,
}: CreateHeaderProps) => {
  const t = useTranslations("characterCreate");
  const translateText = useTranslateText();
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const {
    getValues,
    trigger,
    setFocus,
    formState: { errors },
  } = useFormContext<CharacterCreateFormValues>();
  const { mutateAsync: createUniverse, isPending: isCreatePending } =
    useUniverseCreateMutation();
  const { mutateAsync: updateUniverse, isPending: isUpdatePending } =
    useUniverseUpdateMutation();
  const isEditMode = Boolean(universeId);
  const isPending = isCreatePending || isUpdatePending;

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
    if (!isFormValid) {
      const target = findFirstValidationTarget(errors, getValues());
      if (!target) return;

      setCurrentTabId(target.tabId);
      if (target.scenarioIndex !== undefined) {
        setActiveScenarioIndex(target.scenarioIndex);
      }
      if (target.message) {
        showAppToast("warning", translateText(target.message) ?? target.message);
      }
      if (target.fieldPath) {
        // 탭 전환으로 해당 input이 마운트된 다음 포커스해야 합니다.
        requestAnimationFrame(() => setFocus(target.fieldPath!));
      } else if (target.focusElementId) {
        requestAnimationFrame(() => {
          document.getElementById(target.focusElementId!)?.focus();
        });
      }
      return;
    }

    const currentFormData = getValues();

    try {
      const scenarios = currentFormData.scenarios.map((scenario, index) => ({
        name: scenario.name || `Scenario ${index + 1}`,
        content: serializeScenarioContent(scenario),
      }));
      const assets =
        currentFormData.asset
          ?.filter((asset) => asset.assetImageFileId)
          .map((asset) => ({
            assetImageFileId: String(asset.assetImageFileId),
            assetName: asset.assetName,
            assetSituation: asset.assetSituation,
          })) || [];
      const description =
        currentFormData.characterDescription ||
        currentFormData.profileSituationDescription;

      if (isEditMode && universeId) {
        const request: UniverseUpdateRequest = {
          language: LANGUAGE_BY_LOCALE[locale] ?? "KO",
          commentEnabled: currentFormData.allowComments,
          scenarios,
          assets,
          tendency: toUniverseTendency(currentFormData.tendency),
          visibility: currentFormData.isPublic ? "PUBLIC" : "PRIVATE",
          title: currentFormData.title,
          description,
          tagIds: currentFormData.tagIds.map((tag) => tag.id),
          category: toUniverseCategory(currentFormData.category),
          detailSetting: currentFormData.characterDetailSetting,
          introduce: currentFormData.characterIntroduce,
          // 이미지를 새로 업로드해 fileId를 발급받은 경우에만 전달합니다. 없으면 기존 이미지를 유지합니다.
          ...(currentFormData.representativeImageId
            ? {
                profileImageFileId: String(
                  currentFormData.representativeImageId,
                ),
              }
            : {}),
          character: {
            name: currentFormData.name,
            description: currentFormData.characterDescription,
            detailSetting: currentFormData.characterDetailSetting,
            ...(currentFormData.characterProfileImageId
              ? {
                  profileImageFileId: String(
                    currentFormData.characterProfileImageId,
                  ),
                }
              : {}),
          },
        };

        await updateUniverse({ universeId, request });

        showAppToast("success", t("updateSuccess"));
        markSubmitSuccess();
        router.push(`/characters/${universeId}`);
        return;
      }

      if (
        !currentFormData.representativeImageId ||
        !currentFormData.characterProfileImageId
      ) {
        showAppToast("error", t("createFailed"));
        return;
      }

      const request: UniverseCreateRequest = {
        commentEnabled: currentFormData.allowComments,
        scenarios,
        assets,
        tendency: toUniverseTendency(currentFormData.tendency),
        visibility: currentFormData.isPublic ? "PUBLIC" : "PRIVATE",
        title: currentFormData.title,
        language: LANGUAGE_BY_LOCALE[locale] ?? "KO",
        description,
        tagIds: currentFormData.tagIds.map((tag) => tag.id),
        category: toUniverseCategory(currentFormData.category),
        detailSetting: currentFormData.characterDetailSetting,
        introduce: currentFormData.characterIntroduce,
        profileImageFileId: String(currentFormData.representativeImageId),
        character: {
          profileImageFileId: String(
            currentFormData.characterProfileImageId,
          ),
          name: currentFormData.name,
          description: currentFormData.characterDescription,
          detailSetting: currentFormData.characterDetailSetting,
        },
      };

      const created = await createUniverse(request);

      showAppToast("success", t("createSuccess"));
      markSubmitSuccess();
      router.push(`/characters/${created.universeId}`);
    } catch (error) {
      if (!isApiErrorLike(error)) {
        showAppToast("error", t(isEditMode ? "updateFailed" : "createFailed"));
      }
      console.error("Universe create failed:", error);
    }
  };

  return (
    <header className="flex h-[37px] shrink-0 items-center justify-between">
      <h1 className="title-1 flex items-center gap-2">
        <ArrowLineLeft
          onClick={() => handleSafeBack("/")}
          className="h-6 w-6 cursor-pointer text-font-2"
        />
        {t("headerTitle")}
      </h1>

      <div className="body-4 flex gap-4 whitespace-nowrap">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            className="rounded-xl border border-main bg-card px-5 py-2 hover:bg-card-hover"
          >
            {t("temporarySave")}
          </button>
          <button
            type="button"
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
