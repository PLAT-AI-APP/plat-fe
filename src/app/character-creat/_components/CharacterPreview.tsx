"use client";

import React, { memo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import CreatePreviewList from "./create-preview-list";
import { useAutoResizeTextarea } from "@/hooks/form/useAutoResizeTextarea";
import { useTextareaSubmitShortcuts } from "@/hooks/form/useTextareaSubmitShortcuts";
import { useScrollTimeout } from "@/hooks/dom/useScrollTiemout";
import { ArrowLeft, ArrowRight, Asterisk, Message, MoveUp, User } from "@/icons";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { useScenarioPreviewHistoryStore } from "@/store/useScenarioPreviewHistoryStore";
import { ScenarioContentItem, ScenarioType } from "@/type/character";

interface CharacterPreviewProps {
  activeScenarioIndex: number;
}

// 프로필 이미지를 아직 등록하지 않아도 채팅 프리뷰의 Next Image가 깨지지 않도록 표시용 이미지만 둡니다.
const PREVIEW_PROFILE_FALLBACK_IMAGE = "/images/sample.png";

/** 입력폼 위쪽의 종류 선택 칩. 지금 고른 종류는 브랜드 색 테두리로 표시한다. */
const getModeChipClassName = (isActive: boolean) =>
  cn(
    "body-5 flex h-8 items-center justify-center gap-1.5 rounded-full border border-main bg-dark py-1.5 pl-2.5 pr-3 text-font-2",
    isActive && "border-brand text-brand",
  );

/** 오른쪽 아래 보조 버튼({{user}}·행동 표시). 디자인 기준 높이 34px */
const COMPOSER_TOOL_BUTTON_CLASS_NAME =
  "flex h-8.5 items-center justify-center rounded-lg px-2 py-1.5 text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1 disabled:pointer-events-none disabled:text-font-disabled";

const CharacterPreview = ({ activeScenarioIndex }: CharacterPreviewProps) => {
  const t = useTranslations("characterCreate.preview");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { control, setValue, getValues } =
    useFormContext<CharacterCreateFormValues>();
  const scenarios = useWatch({ control, name: "scenarios" });
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
  const scenarioName = scenarios?.[activeScenarioIndex]?.name;
  const contents = scenarios?.[activeScenarioIndex]?.contents || [];
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
  const [currentMode, setCurrentMode] = useState<ScenarioType>("chat");
  const [msg, setMsg] = useState("");
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea({
    maxRows: 5,
    value: msg,
  });
  const { isScrolling, onScroll } = useScrollTimeout();
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

  const scrollPreviewToBottom = () => {
    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const submitScenarioMessage = () => {
    if (!msg.trim()) return;

    const newContent = {
      id: String(Date.now()),
      type: currentMode,
      value: msg,
    };

    const currentContents =
      getValues(`scenarios.${activeScenarioIndex}.contents`) || [];
    applyScenarioContents([...currentContents, newContent]);
    setMsg("");
    scrollPreviewToBottom();
    requestAnimationFrame(resizeTextarea);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitScenarioMessage();
  };

  const { handleKeyDown: handleTextareaKeyDown } = useTextareaSubmitShortcuts({
    onSubmit: submitScenarioMessage,
  });

  const insertComposerText = (text: string) => {
    // 커서 위치에 토큰/이름을 삽입해 사용자가 긴 문장을 다시 작성하지 않게 합니다.
    const textarea = textareaRef.current;
    if (!textarea) {
      setMsg((prev) => `${prev}${text}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = msg.substring(0, start);
    const after = msg.substring(end);
    const nextText = `${before}${text}${after}`;

    setMsg(nextText);

    window.setTimeout(() => {
      textarea.focus();
      const nextCursorPosition = start + text.length;
      textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
      resizeTextarea();
    }, 0);
  };

  const wrapActionText = () => {
    // 고른 글자를 `**행동**` 으로 감싼다. 고른 게 없으면 빈 표시만 넣고 그 사이에 커서를 둔다.
    const textarea = textareaRef.current;
    if (!textarea) {
      setMsg((prev) => `${prev}****`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = msg.substring(start, end);
    const selectionStart = start + 2;
    const selectionEnd = selectionStart + selectedText.length;

    setMsg(`${msg.substring(0, start)}**${selectedText}**${msg.substring(end)}`);

    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
      resizeTextarea();
    }, 0);
  };

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

      <div
        onScroll={onScroll}
        ref={scrollContainerRef}
        className={cn(
          "custom-scrollbar hide-scrollbar-on-idle min-h-0 flex-1 overflow-y-auto px-2",
          isScrolling && "is-scrolling",
        )}
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

      <form
        onSubmit={handleSubmit}
        onClick={(e) => {
          // textarea/버튼이 아닌 form 여백(툴바 사이 빈 공간 포함)을 클릭해도
          // 바로 입력할 수 있도록 포커스를 옮깁니다.
          const target = e.target as HTMLElement;
          if (target.closest("button, textarea")) return;

          textareaRef.current?.focus();
        }}
        className="flex w-full shrink-0 flex-col gap-4 rounded-3xl border border-dark bg-darkest px-4 py-3 transition-colors focus-within:field-focus!"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentMode("action");
              textareaRef.current?.focus();
            }}
            className={getModeChipClassName(currentMode === "action")}
          >
            <Message className="size-4 shrink-0" />
            {t("action")}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentMode("chat");
              textareaRef.current?.focus();
            }}
            className={getModeChipClassName(currentMode === "chat")}
          >
            {characterProfileImage ? (
              <Image
                src={characterProfileImage}
                alt={characterChipText}
                width={18}
                height={18}
                unoptimized
                className="avatar-img size-4.5"
              />
            ) : (
              <span className="size-4.5 rounded-full bg-font-2" aria-hidden />
            )}
            {characterChipText}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentMode("userChat");
              textareaRef.current?.focus();
            }}
            className={getModeChipClassName(currentMode === "userChat")}
          >
            <User className="size-4.5 shrink-0" />
            {userChipText}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <textarea
            rows={1}
            ref={textareaRef}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder={t("scenarioPlaceholder")}
            className="focus-ring-none body-5 custom-scrollbar min-h-[42px] w-full resize-none bg-transparent outline-none placeholder:text-font-disabled"
          />

          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertComposerText("{{user}}")}
                className={cn("body-5", COMPOSER_TOOL_BUTTON_CLASS_NAME)}
              >
                {"{{user}}"}
              </button>

              <button
                type="button"
                onClick={wrapActionText}
                // `**행동**` 은 캐릭터 대사에서만 행동으로 구분해 그린다. 내레이터·사용자 입력에서는 그대로 글자로 남는다.
                disabled={currentMode !== "chat"}
                aria-label={t("actionMark")}
                className={COMPOSER_TOOL_BUTTON_CLASS_NAME}
              >
                <Asterisk className="size-5" />
              </button>
            </div>

            <button
              type="submit"
              className={cn(
                "flex size-8.5 items-center justify-center rounded-full text-on-brand transition-colors",
                msg.trim() ? "bg-brand" : "bg-font-disabled",
              )}
              aria-label={t("submitScenario")}
            >
              <MoveUp className="size-6" />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default memo(CharacterPreview);
