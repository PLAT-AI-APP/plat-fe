"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigationGuard } from "next-navigation-guard";
import { useRouter } from "next/navigation";
import { decodeScenarioContent } from "@/lib/scenarioContent";
import { showAppToast } from "@/lib/toast";
import { ModalLayout } from "@/components/ModalLayout";
import { Eye } from "@/icons";
import CharacterCardPreviewPanel from "./CharacterCardPreviewPanel";
import CharacterPreview from "./CharacterPreview";
import CreateHeader from "./CreateHeader";
import CreateModals from "./CreateModals";
import CreateTabs, { TabId } from "./CreateTabs";
import {
  characterCreateSchema,
  CharacterCreateFormValues,
} from "@/schema/character.schema";
import {
  applyCharacterDraft,
  buildCharacterDraft,
  collectCharacterDraftFileIds,
  migrateCharacterDraft,
  sanitizeCharacterDraft,
} from "@/schema/characterDraft.schema";
import { useScenarioPreviewHistoryStore } from "@/store/useScenarioPreviewHistoryStore";
import { useUnsavedChangesFallbackGuard } from "@/hooks/useUnsavedChangesFallbackGuard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LOGOUT_REDIRECT_IN_PROGRESS_KEY } from "@/constants/auth";
import {
  UniverseDetailResponse,
  useUniverseDetailQuery,
} from "@/api/universe/getUniverseDetail";
import { useDraftCreateMutation } from "@/api/draft/postDraftCreate";
import { useDraftUpdateMutation } from "@/api/draft/putDraftUpdate";
import { useDraftCurrentQuery } from "@/api/draft/getDraftCurrent";
import { useDraftMutation } from "@/api/draft/getDraft";

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
      difficulty: "NORMAL",
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

const createCharacterEditDefaultValues = (
  universe: UniverseDetailResponse,
  defaultScenarioName: string,
): CharacterCreateFormValues => ({
  representativeImage: universe.profileImageUrl,
  representativeImageId: null,
  characterProfileImage: universe.character.profileImageUrl,
  characterProfileImageId: null,
  title: universe.title,
  name: universe.character.name ?? "",
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
          description: scenario.description,
          ...decodeScenarioContent(scenario.content),
        }))
      : [
          {
            name: defaultScenarioName,
            description: "",
            difficulty: "NORMAL",
            contents: [],
          },
        ],
  isPublic: universe.visibility === "PUBLIC",
  allowComments: universe.commentEnabled,
  characterDescription: universe.description,
  tendency: universe.tendency,
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
  // 초안(임시저장)은 새로 만드는 흐름에만 있고, 이미 만들어진 세계관을 수정할 때는 없습니다.
  // 이번 세션에서 새로 만든 초안 id를 우선 쓰고, 없으면 서버가 갖고 있던 기존 초안 id를 씁니다.
  const [createdDraftId, setCreatedDraftId] = useState<string | null>(null);
  const { data: currentDraft, refetch: refetchCurrentDraft } =
    useDraftCurrentQuery("UNIVERSE", !isEditMode);
  const draftId = createdDraftId ?? currentDraft?.draftId ?? null;
  const { mutateAsync: createDraft } = useDraftCreateMutation();
  const { mutateAsync: updateDraft } = useDraftUpdateMutation();
  const { mutateAsync: fetchDraft } = useDraftMutation();
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
  // 등록/수정 성공 후의 router.push는 폼이 dirty해도 이탈 경고 없이 바로 이동해야 하므로,
  // 성공 시점에 이 플래그를 켜서 아래 useNavigationGuard의 enabled에서 건너뜁니다.
  const isSubmitSuccessRef = useRef(false);
  const markSubmitSuccess = () => {
    isSubmitSuccessRef.current = true;
  };
  // lg 미만(태블릿)에서는 폼과 미리보기를 나란히 둘 폭이 없어 미리보기를 모달 토글로 뺍니다.
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // CSS(hidden lg:block)로만 숨기면 태블릿에서도 사이드 패널이 계속 마운트되어 있어,
  // 미리보기 모달을 열면 CreatePreviewList의 Droppable(id: create-preview-list)이
  // 두 번 마운트되며 dnd 라이브러리가 중복 id로 런타임 에러를 던집니다.
  // lg 미만에서는 사이드 패널 자체를 마운트하지 않도록 분기합니다.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
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

    showAppToast("error", t("loadFailed"));
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
        assetImageFileId: asset.assetImageFileId,
      });
      updateScenarioContentsFromDrag(nextContents);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleSave = async () => {
    const currentData = getValues();
    const draft = buildCharacterDraft(currentData);
    const fileIds = collectCharacterDraftFileIds(draft);
    // 백엔드는 제목을 필수로 받는데, 임시저장은 제목을 채우기 전에도 눌러볼 수 있습니다.
    const title = currentData.title.trim() || t("untitledDraftTitle");

    try {
      if (draftId) {
        await updateDraft({ draftId, request: { title, payload: draft, fileIds } });
      } else {
        const created = await createDraft({
          type: "UNIVERSE",
          title,
          payload: draft,
          fileIds,
        });
        setCreatedDraftId(created.draftId);
      }
      reset(currentData);
      showAppToast("success", t("draftSaved"));
    } catch (error) {
      console.error("Draft save failed:", error);
      showAppToast("error", t("draftSaveFailed"));
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
    // 페이지에 막 들어와 GET /drafts/current 응답이 아직 안 돌아온 시점에 눌렀을 수 있어,
    // 이미 아는 값이 없을 때만 그 자리에서 한 번 더 확인합니다.
    const targetDraftId =
      draftId ?? (await refetchCurrentDraft()).data?.draftId ?? null;

    if (!targetDraftId) {
      closeModal();
      showAppToast("warning", t("draftNotFound"));
      return;
    }

    try {
      const draft = await fetchDraft(targetDraftId);
      // payload는 백엔드가 내부 구조를 검증하지 않는 자유 형식 JSON이라, 폼에 넣기 전에
      // 먼저 안전한 모양으로 정리(sanitize)한 뒤에만 버전 이관을 적용합니다.
      const latest = migrateCharacterDraft(
        sanitizeCharacterDraft(draft.payload),
      );
      reset({
        ...createCharacterCreateDefaultValues(defaultScenarioName),
        ...applyCharacterDraft(latest, defaultScenarioName),
      });
      closeModal();
    } catch (error) {
      console.error("Draft load failed:", error);
      showAppToast("error", t("draftLoadFailed"));
      closeModal();
    }
  };

  // next-navigation-guard가 router.push/back으로 가는 이동은 잘 잡지만, Next.js 16에서
  // <a> 클릭과 브라우저 뒤로가기는 감지하지 못해(라이브러리가 참조하는 Next.js private
  // API가 바뀐 것으로 보임) 직접 보완한다. 링크 클릭과 뒤로가기 둘 다 이 훅이
  // router.push로 대신 보내, 아래 useNavigationGuard가 그대로 잡도록 한다.
  const { leaveToBlockedTarget, isLeavingRef } = useUnsavedChangesFallbackGuard(
    {
      isDirty,
      onBlockedByBack: (targetPath) => {
        setPendingPath(targetPath);
        setActiveModal("UNSAVED");
      },
    },
  );

  const { reject } = useNavigationGuard({
    enabled: (info) => {
      // leaveToBlockedTarget()이 실제로 이탈을 실행하는 동안 발생하는 push까지 이
      // 가드가 다시 붙잡으면, confirm이 항상 동기적으로 false를 반환하는 방식이라
      // 라이브러리가 즉시 "취소"로 해석해 방금 시작한 이탈을 되돌려버린다.
      if (isLeavingRef.current) return false;

      // popstate(브라우저 뒤로가기)는 useUnsavedChangesFallbackGuard가 전담한다.
      // 이 라이브러리의 popstate 감지는 루트에 먼저 마운트돼 있어(NavigationGuardProvider)
      // 같은 이벤트를 우리 훅보다 먼저 받고 stopImmediatePropagation을 호출해버려,
      // 두 핸들러가 같이 popstate를 다루면 순서를 예측할 수 없는 충돌이 난다.
      if (info.type === "popstate") return false;

      // 등록/수정 성공 직후의 이동은 사용자가 의도한 이탈이라 경고 없이 통과시킵니다.
      if (isSubmitSuccessRef.current) return false;

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
      leaveToBlockedTarget(pendingPath);
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
        handleLoadDraft={loadDraftData}
      />

      <div className="flex h-full min-h-0 flex-col gap-4">
        <CreateHeader
          universeId={universeId}
          draftId={draftId}
          onSave={handleSave}
          onDraftClick={handleDraftClick}
          setCurrentTabId={setCurrentTabId}
          setActiveScenarioIndex={setActiveScenarioIndex}
          markSubmitSuccess={markSubmitSuccess}
        />

        {/* lg 미만에서는 폭이 부족해 미리보기를 숨기고 토글 모달로 확인합니다. */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex min-h-0 min-w-0 flex-1 items-start justify-center gap-4">
            <CreateTabs
              currentTabId={currentTabId}
              setCurrentTabId={setCurrentTabId}
              activeScenarioIndex={activeScenarioIndex}
              setActiveScenarioIndex={setActiveScenarioIndex}
              assetFieldArray={assetFieldArray}
            />
            {isDesktop && (
              <div className="hidden lg:block">
                {shouldShowCardPreview ? (
                  <CharacterCardPreviewPanel />
                ) : (
                  <CharacterPreview activeScenarioIndex={activeScenarioIndex} />
                )}
              </div>
            )}
          </div>

          {/* 미리보기 모달의 CharacterPreview도 Droppable을 렌더링하므로
              같은 DragDropContext 안에 있어야 합니다. */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="fixed bottom-6 right-6 z-10 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-on-brand shadow-card-heavy transition-opacity hover:opacity-90 lg:hidden"
          >
            <Eye className="size-5" aria-hidden="true" />
            {t("cardPreview.openPreview")}
          </button>

          {isPreviewOpen && (
            <ModalLayout
              hasBackground
              onClose={() => setIsPreviewOpen(false)}
              className="flex h-[80dvh] w-full max-w-[693px] flex-col"
            >
              {shouldShowCardPreview ? (
                <CharacterCardPreviewPanel />
              ) : (
                <CharacterPreview activeScenarioIndex={activeScenarioIndex} />
              )}
            </ModalLayout>
          )}
        </DragDropContext>
      </div>
    </FormProvider>
  );
};

export default CharacterCreateForm;
