"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigationGuard } from "next-navigation-guard";
import { useRouter } from "next/navigation";
import CharacterPreview from "./CharacterPreview";
import CreateHeader from "./CreateHeader";
import CreateModals from "./CreateModals";
import CreateTabs, { TabId } from "./CreateTabs";
import {
  characterCreateSchema,
  CharacterCreateFormValues,
} from "@/schema/character.schema";

// 기본 입력값은 실제 콘텐츠처럼 보이는 예시이므로 locale 전환과 무관하게 고정합니다.
const CHARACTER_CREATE_DEFAULT_VALUES: CharacterCreateFormValues = {
  representativeImage: "",
  title: "올림포스에서 내려온 나의 수호신",
  name: "아폴로",
  characterIntroduce:
    "눈부신 외모와 다정한 목소리로 당신의 일상을 지켜주는 빛의 신.",
  characterDetailSetting:
    "신분: 올림포스의 빛과 음악의 신\n성격: 평소에는 여유롭고 장난스럽지만 당신에게만은 헌신적이고 은근한 집착을 드러낸다.\n배경: 인간계에 호기심을 갖고 내려왔다가 우연히 당신과 마주치며 일상에 스며들게 됨.",
  asset: [
    {
      assetFile: null,
      assetImage: "/images/sample.png",
      assetName: "행복",
      assetSituation: "캐릭터가 행복이라는 감정을 느낄 때",
    },
  ],
  scenarios: [
    {
      name: "자신 아프로디테와의 만남",
      contents: [
        { id: "1", type: "asset", value: "/images/sample.png" },
        {
          id: "2",
          type: "action",
          value:
            "눈앞에서 은은한 빛이 감돌며 아름다운 여신의 모습이 드러난다.",
        },
        {
          id: "3",
          type: "chat",
          value: "기다리고 있었답니다. 새로운 에버그린의 모험가여.",
        },
        {
          id: "4",
          type: "chat",
          value: "당신은 이곳에서 어떤 운명을 개척하고 싶으신가요?",
        },
        {
          id: "5",
          type: "action",
          value:
            "여신은 부드럽게 미소 지으며 당신에게 선택지를 제시한다.",
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
            "눈앞에서 은은한 빛이 감돌며 아름다운 여신의 모습이 드러난다.",
        },
        {
          id: "3",
          type: "chat",
          value: "기다리고 있었답니다. 새로운 에버그린의 모험가여.",
        },
      ],
    },
  ],
  isPublic: true,
  characterDescription:
    "신화 속 인물과의 설레는 일상 로맨스를 즐길 수 있는 AI 페르소나입니다. 다양한 신들과의 조우를 통해 특별한 이벤트를 경험해 보세요.",
  tendency: "여성향",
  category: "판타지/SF",
  tagIds: [],
};

const CharacterCreateForm = () => {
  const router = useRouter();
  const t = useTranslations("characterCreate");
  const methods = useForm<CharacterCreateFormValues>({
    mode: "onChange",
    resolver: zodResolver(characterCreateSchema),
    defaultValues: CHARACTER_CREATE_DEFAULT_VALUES,
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
        <div className="flex min-h-0 min-w-0 flex-1 items-start justify-center gap-4">
          <CreateTabs
            currentTabId={currentTabId}
            setCurrentTabId={setCurrentTabId}
            activeScenarioIndex={activeScenarioIndex}
            setActiveScenarioIndex={setActiveScenarioIndex}
          />
          <CharacterPreview activeScenarioIndex={activeScenarioIndex} />
        </div>
      </div>
    </FormProvider>
  );
};

export default CharacterCreateForm;
