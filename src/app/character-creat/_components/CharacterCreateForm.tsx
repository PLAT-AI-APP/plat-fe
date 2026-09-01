"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigationGuard } from "next-navigation-guard";
import { useRouter } from "next/navigation";
import { showAppToast } from "@/lib/toast";
import CharacterCardPreviewPanel from "./CharacterCardPreviewPanel";
import CharacterPreview from "./CharacterPreview";
import CreateHeader from "./CreateHeader";
import CreateModals from "./CreateModals";
import CreateTabs, { TabId } from "./CreateTabs";
import {
  characterCreateSchema,
  CharacterCreateFormValues,
} from "@/schema/character.schema";
import { useScenarioPreviewHistoryStore } from "@/store/useScenarioPreviewHistoryStore";
import { LOGOUT_REDIRECT_IN_PROGRESS_KEY } from "@/constants/auth";
import {
  UniverseDetailResponse,
  useUniverseDetailQuery,
} from "@/api/universe/getUniverseDetail";

const createCharacterCreateDefaultValues = (
  defaultScenarioName: string,
): CharacterCreateFormValues => ({
  representativeImage: "",
  representativeImageId: null,
  characterProfileImage: "",
  characterProfileImageId: null,
  title: "",
  name: "",
  characterIntroduce: "",
  profileSituationDescription: "",
  characterDetailSetting: "",
  asset: [],
  scenarios: [
    {
      name: defaultScenarioName,
      description: "",
      difficulty: "",
      contents: [],
    },
  ],
  isPublic: true,
  allowComments: true,
  characterDescription: "",
  tendency: "",
  category: [],
  tagIds: [],
});

const toFormTendency = (tendency: UniverseDetailResponse["tendency"]) => {
  if (tendency === "MALE_ORIENTED") return "MALE";
  if (tendency === "FEMALE_ORIENTED") return "FEMALE";

  return tendency;
};

const createCharacterEditDefaultValues = (
  universe: UniverseDetailResponse,
  defaultScenarioName: string,
): CharacterCreateFormValues => ({
  representativeImage: universe.profileImageUrl,
  representativeImageId: null,
  characterProfileImage: universe.characterProfileUrl,
  characterProfileImageId: null,
  title: universe.title,
  name: universe.characterName,
  characterIntroduce: universe.introduce,
  profileSituationDescription: "",
  characterDetailSetting: universe.detailSetting,
  asset: universe.assets.map((asset) => ({
    assetFile: null,
    assetImage: asset.originalUrl,
    assetImageFileId: asset.assetImageFileId,
    assetName: asset.assetName,
    assetSituation: asset.assetSituation,
    assetVisibility: "PUBLIC",
  })),
  scenarios:
    universe.scenarios.length > 0
      ? universe.scenarios.map((scenario) => ({
          name: scenario.name,
          description: scenario.content,
          difficulty: "",
          contents: [],
        }))
      : [
          {
            name: defaultScenarioName,
            description: "",
            difficulty: "",
            contents: [],
          },
        ],
  isPublic: universe.visibility === "PUBLIC",
  allowComments: universe.commentEnabled,
  characterDescription: universe.description,
  tendency: toFormTendency(universe.tendency),
  category: [universe.category],
  tagIds: universe.hashtags.map((hashtag) => ({
    id: hashtag.hashtagId,
    label: hashtag.label,
  })),
});

interface CharacterCreateFormProps {
  universeId?: string;
}

const CharacterCreateForm = ({ universeId }: CharacterCreateFormProps) => {
  const router = useRouter();
  const t = useTranslations("characterCreate");
  const scenarioT = useTranslations("characterCreate.scenario");
  const defaultScenarioName = scenarioT("fallbackName", { index: 1 });
  const isEditMode = Boolean(universeId);
  const { data: universeDetail, isError: isUniverseDetailError } =
    useUniverseDetailQuery(universeId);
  const methods = useForm<CharacterCreateFormValues>({
    mode: "onChange",
    resolver: zodResolver(characterCreateSchema),
    // 첫 시나리오 탭은 기본으로 노출되므로 input 값도 같은 이름으로 시작합니다.
    defaultValues: createCharacterCreateDefaultValues(defaultScenarioName),
  });
  const assetFieldArray = useFieldArray({
    control: methods.control,
    name: "asset",
  });
  const recordScenarioChange = useScenarioPreviewHistoryStore(
    (state) => state.recordChange,
  );

  const [currentTabId, setCurrentTabId] = useState<TabId>("profile");
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<
    "OVERWRITE" | "RESUME" | "UNSAVED" | null
  >(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  // 프로필/상세정보/설정 탭은 시나리오 편집 대신 카드에 반영되는 값을 미리 보여줍니다.
  const shouldShowCardPreview =
    currentTabId === "profile" ||
    currentTabId === "details" ||
    currentTabId === "settings";
  const {
    formState: { isDirty },
    reset,
    getValues,
    setValue,
  } = methods;

  useEffect(() => {
    if (!universeDetail) return;

    reset(
      createCharacterEditDefaultValues(universeDetail, defaultScenarioName),
    );
  }, [defaultScenarioName, reset, universeDetail]);

  useEffect(() => {
    if (!isEditMode || !isUniverseDetailError) return;

    showAppToast(
      "error",
      "캐릭터 수정 정보를 불러오지 못했습니다. 다시 시도해주세요.",
    );
  }, [isEditMode, isUniverseDetailError]);

  const updateScenarioContentsFromDrag = (
    nextContents: CharacterCreateFormValues["scenarios"][number]["contents"],
  ) => {
    const currentContents =
      getValues(`scenarios.${activeScenarioIndex}.contents`) || [];

    recordScenarioChange(
      `scenario-${activeScenarioIndex}`,
      currentContents,
      nextContents,
    );
    setValue(`scenarios.${activeScenarioIndex}.contents`, nextContents, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === "asset-list-droppable" &&
      destination.droppableId === "asset-list-droppable"
    ) {
      assetFieldArray.move(source.index, destination.index);
      return;
    }

    if (
      source.droppableId === "create-preview-list" &&
      destination.droppableId === "create-preview-list"
    ) {
      const currentContents =
        getValues(`scenarios.${activeScenarioIndex}.contents`) || [];
      const nextContents = Array.from(currentContents);
      const [movedContent] = nextContents.splice(source.index, 1);
      nextContents.splice(destination.index, 0, movedContent);
      updateScenarioContentsFromDrag(nextContents);
      return;
    }

    if (
      source.droppableId === "asset-list-droppable" &&
      destination.droppableId === "create-preview-list"
    ) {
      const asset = getValues(`asset.${source.index}`);
      if (!asset?.assetImage) return;

      const currentContents =
        getValues(`scenarios.${activeScenarioIndex}.contents`) || [];
      const nextContents = Array.from(currentContents);
      nextContents.splice(destination.index, 0, {
        id: String(Date.now()),
        type: "asset",
        value: asset.assetImage,
      });
      updateScenarioContentsFromDrag(nextContents);
    }
  };

  const closeModal = () => setActiveModal(null);

  const handleSave = async () => {
    const currentData = getValues();
    try {
      reset(currentData);
      showAppToast("success", t("draftSaved"));
    } catch (error) {
      console.error("Draft save failed:", error);
    }
  };

  const handleDraftClick = () => {
    if (isDirty) {
      setActiveModal("OVERWRITE");
      return;
    }

    void loadDraftData();
  };

  const loadDraftData = async () => {
    try {
      closeModal();
    } catch {
      showAppToast("error", t("draftLoadFailed"));
    }
  };

  const { reject } = useNavigationGuard({
    enabled: () => {
      const isLogoutRedirecting =
        typeof window !== "undefined" &&
        sessionStorage.getItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY) === "true";

      return isDirty && !isLogoutRedirecting;
    },
    confirm: (info) => {
      setPendingPath(info.to);
      setActiveModal("UNSAVED");
      return false;
    },
  });

  const handleConfirmExit = () => {
    setActiveModal(null);
    reset(getValues());
    if (pendingPath) {
      router.push(pendingPath);
      return;
    }
    router.back();
  };

  return (
    <FormProvider {...methods}>
      <CreateModals
        activeModal={activeModal}
        closeModal={closeModal}
        handleConfirmExit={handleConfirmExit}
        rejectNavigation={reject}
      />

      <div className="flex h-full min-h-0 flex-col gap-4">
        <CreateHeader
          universeId={universeId}
          onSave={handleSave}
          onDraftClick={handleDraftClick}
        />

        {/* Figma frame keeps the editor and preview as fixed columns inside a 1200px body. */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex min-h-0 min-w-0 flex-1 items-start justify-center gap-4">
            <CreateTabs
              currentTabId={currentTabId}
              setCurrentTabId={setCurrentTabId}
              activeScenarioIndex={activeScenarioIndex}
              setActiveScenarioIndex={setActiveScenarioIndex}
              assetFieldArray={assetFieldArray}
            />
            {shouldShowCardPreview ? (
              <CharacterCardPreviewPanel />
            ) : (
              <CharacterPreview activeScenarioIndex={activeScenarioIndex} />
            )}
          </div>
        </DragDropContext>
      </div>
    </FormProvider>
  );
};

export default CharacterCreateForm;
