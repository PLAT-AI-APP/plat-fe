"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CharacterCreateFormValues } from "@/type/character";
import CharacterPreview from "./CharacterPreview";
import { useNavigationGuard } from "next-navigation-guard";
import { useRouter } from "next/navigation";
import CreateHeader from "./CreateHeader";
import CreateTabs, { TabId } from "./CreateTabs";
import CreateModals from "./CreateModals";

const CharacterCreateForm = () => {
  const router = useRouter();
  const methods = useForm<CharacterCreateFormValues>({
    mode: "onChange",
    defaultValues: {
      representativeImage: "",
      title: "",
      name: "",
      characterIntroduce: "",
      characterDetailSetting: "",
      asset: [
        {
          assetFile: null,
          assetImage: "/images/sample.png",
          assetName: "행복",
          assetSituation: "캐릭터가 행복이라는 감정을 느낄 떄",
        },
      ],
      scenarios: [
        {
          name: "여신 아프로디테와의 만남",
          contents: [
            { id: "1", type: "asset", value: "/images/sample.png" },
            {
              id: "2",
              type: "action",
              value:
                "눈앞에 눈부신 빛이 감돌며 아름다운 여신이 모습을 드러낸다.",
            },
            {
              id: "3",
              type: "chat",
              value: "기다리고 있었습니다, 에버그린의 새로운 모험가여.",
            },
            {
              id: "4",
              type: "chat",
              value: "당신은 이곳에서 어떤 운명을 개척하고 싶으신가요?",
            },
            {
              id: "5",
              type: "action",
              value: "여신이 부드럽게 미소 지으며 당신에게 선택지를 제시한다.",
            },
          ],
        },
        {
          name: "제우스와의 만남",
          contents: [
            { id: "1", type: "asset", value: "/images/sample.png" },
            {
              id: "2",
              type: "action",
              value:
                "눈앞에 눈부신 빛이 감돌며 아름다운 여신이 모습을 드러낸다.",
            },
            {
              id: "3",
              type: "chat",
              value: "기다리고 있었습니다, 에버그린의 새로운 모험가여.",
            },
          ],
        },
      ],
      isPublic: true,
      characterDescription: "",
      tendency: "전체",
      category: "",
      tagList: [],
    },
  });

  const [currentTabId, setCurrentTabId] = useState<TabId>("profile");
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<
    "OVERWRITE" | "RESUME" | "UNSAVED" | null
  >(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const {
    formState: { isDirty },
    reset,
    getValues,
  } = methods;

  const closeModal = () => setActiveModal(null);

  const handleSave = async () => {
    const currentData = getValues();
    try {
      reset(currentData);
      alert("임시저장이 완료되었습니다.");
    } catch (error) {
      console.error("저장 실패", error);
    }
  };

  const handleDraftClick = () => {
    if (isDirty) {
      setActiveModal("OVERWRITE");
    } else {
      loadDraftData();
    }
  };

  const loadDraftData = async () => {
    try {
      closeModal();
    } catch (error) {
      alert("초안을 불러오지 못했습니다.");
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
    } else {
      router.back();
    }
  };

  return (
    <FormProvider {...methods}>
      {/* 임시저장, 초안 불러오기 dialog */}
      <CreateModals
        activeModal={activeModal}
        closeModal={closeModal}
        handleConfirmExit={handleConfirmExit}
        rejectNavigation={reject}
      />

      <CreateHeader onSave={handleSave} onDraftClick={handleDraftClick} />

      <div className="flex gap-4 flex-1 min-w-0">
        <CreateTabs
          currentTabId={currentTabId}
          setCurrentTabId={setCurrentTabId}
          activeScenarioIndex={activeScenarioIndex}
          setActiveScenarioIndex={setActiveScenarioIndex}
        />
        <CharacterPreview activeScenarioIndex={activeScenarioIndex} />
      </div>
    </FormProvider>
  );
};

export default CharacterCreateForm;
