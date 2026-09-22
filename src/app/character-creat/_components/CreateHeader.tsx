"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMutating } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FieldErrors, FieldPath, useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import ActiveButton from "@/components/ActiveButton";
import ArrowLineLeft from "@/icons/ArrowLineLeft";
import { Redo } from "@/icons";
import { encodeScenarioContent } from "@/lib/scenarioContent";
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
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
import { TabId } from "./CreateTabs";

interface CreateHeaderProps {
  universeId?: string;
  // 이 초안에서 세계관을 만든 경우에만 있습니다. 등록 성공 시 실어 보내면 백엔드가 그 초안을 자동 삭제합니다.
  draftId: string | null;
  onSave: () => void;
  /** 임시저장 요청 중. 버튼에 대기 표시를 하고 다시 누를 수 없게 한다. */
  isSaving: boolean;
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

    // contents 항목을 합친 뒤(encodeScenarioContent)의 총 길이 초과는 배열 자체에
    // 에러가 달려 항목별 에러(.contents[j].value)와 모양이 다릅니다.
    const contentsTotalError = scenarioError?.contents as
      | { message?: string }
      | undefined;
    if (contentsTotalError?.message && !Array.isArray(contentsTotalError)) {
      return {
        tabId: "scenario",
        scenarioIndex: i,
        message: contentsTotalError.message,
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
  draftId,
  onSave,
  isSaving,
  onDraftClick,
  setCurrentTabId,
  setActiveScenarioIndex,
  markSubmitSuccess,
}: CreateHeaderProps) => {
  const t = useTranslations("characterCreate");
  const translateText = useTranslateText();
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const { getValues, handleSubmit, setFocus } =
    useFormContext<CharacterCreateFormValues>();
  const { mutateAsync: createUniverse, isPending: isCreatePending } =
    useUniverseCreateMutation();
  const { mutateAsync: updateUniverse, isPending: isUpdatePending } =
    useUniverseUpdateMutation();
  const isEditMode = Boolean(universeId);
  const isMutationPending = isCreatePending || isUpdatePending;
  // 이미지는 고르는 즉시 미리보기에 뜨고 업로드는 뒤에서 이어진다. 끝나야 fileId 가 채워지므로
  // 그동안은 등록·임시저장을 대기 상태로 둔다(누르면 이미지 없이 저장되거나 검증에 걸렸다).
  const isUploadingImages =
    useIsMutating({ mutationKey: ["post-file-upload"] }) +
      useIsMutating({ mutationKey: ["post-universe-asset-image"] }) >
    0;
  // 검증(zod parseAsync)은 비동기라, 그동안에는 아직 요청이 시작되지 않아 isPending 이 false 다.
  // 그 틈에 들어온 두 번째 클릭이 그대로 통과해 세계관이 둘 만들어질 수 있었다.
  // 성공한 뒤에도 풀지 않는다 — router.push 가 끝나기 전에 다시 눌리면 마찬가지다.
  const isSubmitLockedRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const markSubmitted = () => {
    hasSubmittedRef.current = true;
    markSubmitSuccess();
  };
  const isSubmitInFlight = isMutationPending || isSubmitting;
  const isPending = isSubmitInFlight || isUploadingImages;

  const handleSafeBack = (fallbackPath = "/") => {
    if (window.history.state.__next_navigation_guard_stack_index > 0) {
      router.back();
      return;
    }

    router.push(fallbackPath);
  };

  // 검증에 실패했을 때: 첫 오류가 있는 탭으로 옮기고 이유를 알린다.
  const handleInvalid = (errors: FieldErrors<CharacterCreateFormValues>) => {
    const target = findFirstValidationTarget(errors, getValues());

    // 안내는 이동/포커스보다 먼저, 그리고 어떤 경우에도 띄운다. 이동 대상이나 문구를 못 찾아도
    // 검증에 걸렸다는 사실은 알려야 사용자가 "눌러도 반응이 없다"고 느끼지 않는다.
    showAppToast(
      "warning",
      (target?.message && translateText(target.message)) ||
        target?.message ||
        t("validationFailed"),
    );
    if (!target) return;

    setCurrentTabId(target.tabId);
    if (target.scenarioIndex !== undefined) {
      setActiveScenarioIndex(target.scenarioIndex);
    }
    if (target.fieldPath) {
      // 탭 전환으로 해당 input이 마운트된 다음 포커스해야 합니다.
      requestAnimationFrame(() => setFocus(target.fieldPath!));
    } else if (target.focusElementId) {
      requestAnimationFrame(() => {
        document.getElementById(target.focusElementId!)?.focus();
      });
    }
  };

  // 검증을 통과했을 때: 등록(수정) 요청을 보낸다.
  const submitValidForm = async () => {
    const currentFormData = getValues();

    try {
      const scenarios = currentFormData.scenarios.map((scenario, index) => ({
        name: scenario.name || `Scenario ${index + 1}`,
        description: scenario.description ?? "",
        content: encodeScenarioContent(scenario),
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
          detailSetting: currentFormData.profileSituationDescription,
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
        markSubmitted();
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
        detailSetting: currentFormData.profileSituationDescription,
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
        // 이 초안에서 만든 경우에만 실어 보냅니다 — 성공하면 백엔드가 해당 초안을 자동 삭제합니다.
        ...(draftId ? { draftId } : {}),
      };

      const created = await createUniverse(request);

      showAppToast("success", t("createSuccess"));
      markSubmitted();
      router.push(`/characters/${created.universeId}`);
    } catch (error) {
      if (!isApiErrorLike(error)) {
        showAppToast("error", t(isEditMode ? "updateFailed" : "createFailed"));
      }
      console.error("Universe create failed:", error);
    }
  };

  const handleRegisterClick = async () => {
    if (isSubmitLockedRef.current || isUploadingImages) return;

    isSubmitLockedRef.current = true;
    setIsSubmitting(true);

    // trigger() 로 검증한 뒤 렌더링 때 잡아 둔 errors 를 읽으면, 폼이 mode:"onChange" 라 페이지에 들어와
    // 아직 아무것도 검증되지 않은 첫 클릭에서는 errors 가 비어 있어 아무 안내 없이 끝났다.
    // handleSubmit 은 방금 검증한 결과를 onInvalid 로 넘겨 주므로 그 값을 쓴다.
    try {
      await handleSubmit(submitValidForm, handleInvalid)();
    } catch (error) {
      // 검증 자체가 예외로 끊기면 promise rejection 으로만 남아 화면에는 아무 반응이 없었다.
      showAppToast("error", t(isEditMode ? "updateFailed" : "createFailed"));
      console.error("Universe form validation failed:", error);
    } finally {
      // 성공하면 화면이 넘어가므로 잠근 채로 둔다. 실패·검증 탈락일 때만 다시 누를 수 있게 한다.
      if (!hasSubmittedRef.current) {
        isSubmitLockedRef.current = false;
        setIsSubmitting(false);
      }
    }
  };

  return (
    <header className="flex h-[37px] shrink-0 items-center justify-between">
      <h1 className="title-1 flex items-center gap-2">
        <ArrowLineLeft
          onClick={() => handleSafeBack("/")}
          className="h-6 w-6 cursor-pointer text-font-2"
        />
        {isEditMode ? t("headerTitleEdit") : t("headerTitle")}
      </h1>

      <div className="body-5 flex gap-4 whitespace-nowrap">
        {!isEditMode && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || isUploadingImages}
              aria-busy={isSaving || isUploadingImages || undefined}
              className={cn(
                "rounded-xl border border-main bg-card px-5 py-2 hover:bg-card-hover",
                (isSaving || isUploadingImages) && "pending-state",
              )}
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
        )}

        <ActiveButton
          isActive
          text={
            // 이미지 업로드를 기다리는 동안은 스피너만 돌고 문구는 그대로 둔다("등록 중"이 아니다).
            isEditMode
              ? isSubmitInFlight
                ? t("submittingEdit")
                : t("submitEdit")
              : isSubmitInFlight
                ? t("submitting")
                : t("submit")
          }
          isPending={isPending}
          className="h-9 rounded-xl px-4 py-2"
          onClick={handleRegisterClick}
        />
      </div>
    </header>
  );
};

export default CreateHeader;
