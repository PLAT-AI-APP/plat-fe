"use client";

import React, { memo, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import CreatePreviewList from "./create-preview-list";
import ScenarioComposer from "./ScenarioComposer";
import { useScrollTimeout } from "@/hooks/dom/useScrollTiemout";
import { ArrowLeft, ArrowRight } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { useScenarioPreviewHistoryStore } from "@/store/useScenarioPreviewHistoryStore";
import { ScenarioContentItem, ScenarioType } from "@/type/character";

interface CharacterPreviewProps {
  activeScenarioIndex: number;
}

const EMPTY_CONTENTS: ScenarioContentItem[] = [];

// 프로필 이미지를 아직 등록하지 않아도 채팅 프리뷰의 Next Image가 깨지지 않도록 표시용 이미지만 둡니다.
const PREVIEW_PROFILE_FALLBACK_IMAGE = "/images/sample.png";

const scrollToBottom = (container: HTMLDivElement | null) => {
  requestAnimationFrame(() => {
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  });
};

const CharacterPreview = ({ activeScenarioIndex }: CharacterPreviewProps) => {
  const t = useTranslations("characterCreate.preview");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { control, setValue, getValues } =
    useFormContext<CharacterCreateFormValues>();
  // 시나리오 배열 전체를 구독하면 다른 시나리오의 이름 한 글자에도 새 배열이 와 미리보기 전체가
  // 다시 그려졌다. 지금 보고 있는 시나리오의 이름과 내용만 구독한다.
  const scenarioName = useWatch({
    control,
    name: `scenarios.${activeScenarioIndex}.name`,
  });
  const watchedContents = useWatch({
    control,
    name: `scenarios.${activeScenarioIndex}.contents`,
  });
  const name = useWatch({ control, name: "name" });
  const representativeImage = useWatch({
    control,
    name: "representativeImage",
  });
  const characterProfileImage = useWatch({
    control,
    name: "characterProfileImage",
  });
  const characterName = name || t("defaultCharacterName");
  const characterChipText = name?.trim() || t("characterNameChip");
  const userChipText = t("userNameChip");
  const contents = watchedContents ?? EMPTY_CONTENTS;
  const scenarioHistoryKey = `scenario-${activeScenarioIndex}`;
  const scenarioHistory = useScenarioPreviewHistoryStore(
    (state) => state.histories[scenarioHistoryKey],
  );
  const recordScenarioChange = useScenarioPreviewHistoryStore(
    (state) => state.recordChange,
  );
  const undoScenarioChange = useScenarioPreviewHistoryStore(
    (state) => state.undo,
  );
  const redoScenarioChange = useScenarioPreviewHistoryStore(
    (state) => state.redo,
  );
  const canUndoScenario = (scenarioHistory?.past.length ?? 0) > 0;
  const canRedoScenario = (scenarioHistory?.future.length ?? 0) > 0;
  const { onScroll } = useScrollTimeout();
  const previewProfileImage =
    representativeImage || PREVIEW_PROFILE_FALLBACK_IMAGE;

  const applyScenarioContents = (
    nextContents: ScenarioContentItem[],
    shouldRecord = true,
  ) => {
    // 프리뷰 변경은 React Hook Form 값과 Zustand 히스토리를 함께 갱신해 undo/redo 기준을 일치시킵니다.
    if (shouldRecord) {
      recordScenarioChange(scenarioHistoryKey, contents, nextContents);
    }

    setValue(`scenarios.${activeScenarioIndex}.contents`, nextContents, {
      shouldValidate: true,
    });
  };

  // 입력창(memo)에 넘기는 콜백을 매 렌더 새로 만들지 않도록, 최신 함수를 ref 로 읽는다.
  const applyScenarioContentsRef = useRef(applyScenarioContents);
  useEffect(() => {
    applyScenarioContentsRef.current = applyScenarioContents;
  });

  const handleUpdateContent = (id: string, newValue: string) => {
    const updatedContents = contents.map((item) =>
      item.id === id ? { ...item, value: newValue } : item,
    );
    applyScenarioContents(updatedContents);
  };

  const handleDeleteContent = (id: string) => {
    const updatedContents = contents.filter((item) => item.id !== id);
    applyScenarioContents(updatedContents);
  };

  const handleUndoScenario = () => {
    const previousContents = undoScenarioChange(scenarioHistoryKey);
    if (!previousContents) return;

    applyScenarioContents(previousContents, false);
  };

  const handleRedoScenario = () => {
    const nextContents = redoScenarioChange(scenarioHistoryKey);
    if (!nextContents) return;

    applyScenarioContents(nextContents, false);
  };

  const submitScenarioMessage = useCallback(
    (type: ScenarioType, value: string) => {
      const newContent = {
        id: String(Date.now()),
        type,
        value,
      };

      const currentContents =
        getValues(`scenarios.${activeScenarioIndex}.contents`) || [];
      applyScenarioContentsRef.current([...currentContents, newContent]);
      scrollToBottom(scrollContainerRef.current);
    },
    [activeScenarioIndex, getValues],
  );

  return (
    <section className="flex h-full max-h-[calc(100dvh-var(--header-height)-5.5rem)] w-full max-w-[693px] flex-col rounded-3xl bg-darker p-4 lg:h-[919px]">
      <header className="mb-12 flex h-12 shrink-0 items-center justify-between rounded-2xl bg-darkest px-4 py-3">
        <strong className="title-3 truncate text-font-1">
          {scenarioName ||
            t("scenarioFallback", { index: activeScenarioIndex + 1 })}
        </strong>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleUndoScenario}
            disabled={!canUndoScenario}
            className="flex size-6.5 items-center justify-center rounded-lg text-font-2 transition-colors hover:bg-card-selected disabled:pointer-events-none disabled:text-font-disabled"
            aria-label={t("undoScenario")}
          >
            <ArrowLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedoScenario}
            disabled={!canRedoScenario}
            className="flex size-6.5 items-center justify-center rounded-lg text-font-2 transition-colors hover:bg-card-selected disabled:pointer-events-none disabled:text-font-disabled"
            aria-label={t("redoScenario")}
          >
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </header>

      {/* 드롭 영역(CreatePreviewList)이 flex-1 로 이 스크롤 영역을 꽉 채우도록 flex 컨테이너로 둔다.
          예전에는 flex-1 이 먹지 않아 내용이 없을 때 드롭 영역 높이가 0 이 되었고, 에셋을 끌어다 놓을
          자리가 없어 첫 에셋이 등록되지 않았다. */}
      <div
        onScroll={onScroll}
        ref={scrollContainerRef}
        className="custom-scrollbar hide-scrollbar-on-idle flex min-h-0 flex-1 flex-col overflow-y-auto px-2"
      >
        <CreatePreviewList
          contents={contents}
          characterName={characterName}
          profileImage={previewProfileImage}
          isEditable
          onUpdate={handleUpdateContent}
          onDelete={handleDeleteContent}
        />
      </div>

      <ScenarioComposer
        characterChipText={characterChipText}
        userChipText={userChipText}
        characterProfileImage={characterProfileImage}
        onSubmit={submitScenarioMessage}
      />
    </section>
  );
};

export default memo(CharacterPreview);
