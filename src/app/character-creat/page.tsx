"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/type/character";
import Profile from "./_components/profile";
import DetailInfo from "./_components/detail-info";
import Asset from "./_components/asset";
import Scenario from "./_components/scenario";
import Setting from "./_components/setting";
import CharacterPreview from "./_components/CharacterPreview";
import Dialog from "@/components/Dialog";
import { Redo } from "@/icons";
import { useNavigationGuard } from "next-navigation-guard";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "profile", title: "프로필", component: Profile },
  { id: "details", title: "상세정보", component: DetailInfo },
  { id: "assets", title: "에셋", component: Asset },
  { id: "scenario", title: "시나리오", component: Scenario },
  { id: "settings", title: "설정", component: Setting },
] as const;

const CharacterCreatPage = () => {
  const router = useRouter();
  // 상태 및 초기값
  const methods = useForm<CharacterCreateFormValues>({
    defaultValues: {
      representativeImage: "",
      title: "",
      name: "",
      characterIntroduce: "",
      // height: "",
      // weight: "",
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
          name: "기본 시나리오",
          messages: [
            {
              id: "1",
              role: "assistant",
              characterName: "윤아",
              profileImage: "/images/sample.png",
              content: `"나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든."\n\n{{img:/images/sample.png}}\n\n*그녀는 환하게 웃으며\n내 소매를 살짝 잡아끌었다.*`,
            },
            {
              id: "2",
              role: "user",
              content: "나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든.",
            },
          ],
        },
      ],
      isPublic: true,
      characterDescription: "",
      tendency: "전체",
      category: "",
      tagList: [{ name: "취미" }, { name: "여행" }],
    },
  });

  const [currentTabId, setCurrentTabId] =
    useState<(typeof TABS)[number]["id"]>("profile");
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);

  // 파생 데이터
  const activeTab = TABS.find((tab) => tab.id === currentTabId);
  const ActiveComponent = activeTab?.component;

  const {
    formState: { isDirty },
    reset,
    getValues,
  } = { ...methods };
  const isSavedData = false;

  // 모달 타입 정의
  type ModalType = "OVERWRITE" | "RESUME" | "UNSAVED" | null;

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // 유틸리티 함수: 모든 모달 닫기
  const closeModal = () => setActiveModal(null);

  // 임시저장
  const handleSave = async () => {
    const currentData = getValues();
    try {
      // await saveTempData(currentData);
      reset(currentData);
      alert("임시저장이 완료되었습니다.");
    } catch (error) {
      console.error("저장 실패", error);
    }
  };

  // 초안 불러오기 버튼 클릭
  const handleDraftClick = () => {
    if (isDirty) {
      setActiveModal("OVERWRITE"); // 덮어쓰기 모달 오픈
    } else {
      loadDraftData();
    }
  };

  // 실제 데이터 불러오기 함수
  const loadDraftData = async () => {
    try {
      // const draftData = await fetchDraftData();
      // reset(draftData);
      closeModal();
    } catch (error) {
      alert("초안을 불러오지 못했습니다.");
    }
  };

  const [pendingPath, setPendingPath] = useState<string | null>(null); // 가려던 경로 저장용
  // 가드 설정
  const { reject } = useNavigationGuard({
    enabled: isDirty, // 수정 중일 때만 작동
    confirm: (info) => {
      setPendingPath(info.to);
      setActiveModal("UNSAVED");
      return false;
    },
  });

  // 나가기 확인 핸들러 (강제 이동)
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
    <section
      id="character-create-main"
      className="flex flex-col flex-1 min-w-0 p-5 h-[calc(100vh-60px)]"
    >
      {isSavedData && (
        <Dialog
          label={"이미 저장된 데이터가 존재합니다"}
          description="임시저장된 데이터를 덮어쓸까요?"
          onClose={closeModal}
        />
      )}
      {activeModal === "UNSAVED" && (
        <Dialog
          label="저장되지 않은 변경사항이 있습니다."
          description="지금 나가시면 수정된 내용은 저장되지 않습니다."
          confirmText="나가기"
          confirmFn={handleConfirmExit}
          onClose={() => {
            setActiveModal(null);
            reject();
          }}
          cancelFn={() => {
            setActiveModal(null);
            reject();
          }}
        />
      )}
      {activeModal === "OVERWRITE" && (
        <Dialog
          label={
            <p className="text-white text-lg font-medium text-center">
              임시저장된 데이터를 <span className="text-brand">불러</span>
              올까요?
            </p>
          }
          description="저장하지 않은 데이터는 모두 사라집니다."
          onClose={closeModal}
        />
      )}
      <FormProvider {...methods}>
        <header className="flex items-center justify-between pb-4">
          <h2 className="text-[20px] font-medium">캐릭터 생성</h2>

          <div className="flex gap-4 whitespace-nowrap">
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-card border border-border-main rounded-xl hover:bg-card-hover"
              >
                임시저장
              </button>
              <button
                onClick={handleDraftClick}
                className="flex items-center justify-center p-2 h-full aspect-square bg-card border border-border-main rounded-xl hover:bg-card-hover"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
            <button className="px-5 py-2 bg-brand rounded-xl">등록</button>
          </div>
        </header>

        <div className="flex gap-4 flex-1 min-w-0 pb-5">
          <section className="flex-1 min-w-0 max-w-125 h-full p-5 rounded-3xl bg-bg-darker border border-border-main">
            <nav className="flex gap-1 border-b-2 border-font-disabled mb-9">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setCurrentTabId(tab.id)}
                  className={cn(
                    "text-sm text-font-2 p-2.5 cursor-pointer translate-y-0.5 outline-none",
                    currentTabId === tab.id &&
                      "text-font-1 font-semibold border-b-2 border-brand",
                  )}
                >
                  {tab.title}
                </button>
              ))}
            </nav>
            {ActiveComponent && (
              <ActiveComponent
                activeScenarioIndex={activeScenarioIndex}
                setActiveScenarioIndex={setActiveScenarioIndex}
              />
            )}
          </section>

          <CharacterPreview activeScenarioIndex={activeScenarioIndex} />
        </div>
      </FormProvider>
    </section>
  );
};

export default CharacterCreatPage;
