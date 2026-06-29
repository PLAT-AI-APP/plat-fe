"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigationGuard } from "next-navigation-guard";
import { useRouter } from "next/navigation";
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

const createCharacterCreateDefaultValues = (
  defaultScenarioName: string,
): CharacterCreateFormValues => ({
  representativeImage: "",
  characterProfileImage: "",
  title: "",
  name: "",
  characterIntroduce: "",
  profileSituationDescription: "",
  characterDetailSetting: "",
  asset: [],
  scenarios: [
    {
      name: defaultScenarioName,
      contents: [],
    },
  ],
  isPublic: true,
  characterDescription: "",
  tendency: "",
  category: [],
  tagIds: [],
});

const CharacterCreateForm = () => {
  const router = useRouter();
  const t = useTranslations("characterCreate");
  const scenarioT = useTranslations("characterCreate.scenario");
  const methods = useForm<CharacterCreateFormValues>({
    mode: "onChange",
    resolver: zodResolver(characterCreateSchema),
    // 첫 시나리오 탭은 기본으로 노출되므로 input 값도 같은 이름으로 시작합니다.
    defaultValues: createCharacterCreateDefaultValues(
      scenarioT("fallbackName", { index: 1 }),
    ),
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
      alert(t("draftSaved"));
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
      alert(t("draftLoadFailed"));
    }
  };

  const { reject } = useNavigationGuard({
    enabled: isDirty,
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
        <CreateHeader onSave={handleSave} onDraftClick={handleDraftClick} />

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
