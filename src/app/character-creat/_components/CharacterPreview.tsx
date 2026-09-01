"use client";

import React, { memo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import CreatePreviewList from "./create-preview-list";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { ArrowLeft, ArrowRight, Asterisk, User } from "@/icons";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { useScenarioPreviewHistoryStore } from "@/store/useScenarioPreviewHistoryStore";
import { useUserStore } from "@/store/useUserStore";
import { ScenarioContentItem, ScenarioType } from "@/type/character";
import Upload from "@/icons/Upload";

interface CharacterPreviewProps {
  activeScenarioIndex: number;
}

// 프로필 이미지를 아직 등록하지 않아도 채팅 프리뷰의 Next Image가 깨지지 않도록 표시용 이미지만 둡니다.
const PREVIEW_PROFILE_FALLBACK_IMAGE = "/images/sample.png";

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
  const userNickname = useUserStore((state) => state.user?.nickname);
  const characterName = name || t("defaultCharacterName");
  const characterChipText = name?.trim() || t("characterNameChip");
  const userChipText = userNickname?.trim() || t("userNameChip");
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleCurrentMode = (mode: ScenarioType) => {
    if (mode === currentMode) {
      setCurrentMode("chat");
      return;
    }

    setCurrentMode(mode);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setCurrentMode("chat");
    scrollPreviewToBottom();
  };

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
    }, 0);
  };

  return (
    <section className="flex h-[919px] max-h-[calc(100vh-145px)] w-[693px] shrink-0 flex-col gap-[66px] rounded-3xl bg-darker p-4">
      <header className="flex h-12 shrink-0 items-center justify-between rounded-2xl bg-darkest px-4 py-3">
        <strong className="title-3 truncate text-font-1">
          {scenarioName ||
            t("scenarioFallback", { index: activeScenarioIndex + 1 })}
        </strong>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleUndoScenario}
            disabled={!canUndoScenario}
            className="flex size-6.5 items-center justify-center rounded-lg text-font-2 transition-colors hover:bg-card-selected"
            aria-label={t("undoScenario")}
          >
            <ArrowLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedoScenario}
            disabled={!canRedoScenario}
            className="flex size-6.5 items-center justify-center rounded-lg text-font-2 transition-colors hover:bg-card-selected"
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
        className="flex w-full shrink-0 flex-col gap-4 rounded-3xl border border-dark bg-darkest px-4 pb-3 pt-4"
      >
        <textarea
          rows={1}
          ref={textareaRef}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder={t("scenarioPlaceholder")}
          className="body-4 min-h-[42px] w-full resize-none bg-transparent outline-none placeholder:text-font-disabled"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 shrink-0 gap-2">
            <button
              type="button"
              onClick={() => handleCurrentMode("action")}
              className={cn(
                "body-4 flex h-8 items-center justify-center gap-1.5 rounded-[100px] border border-main bg-dark py-1.5 pl-2.5 pr-3 text-font-2",
                currentMode === "action" && "border-brand text-brand",
              )}
            >
              <Asterisk className="size-4 shrink-0" />
              {t("action")}
            </button>

            <button
              type="button"
              onClick={() => setCurrentMode("chat")}
              className={cn(
                "body-4 flex h-8 items-center justify-center gap-1.5 rounded-[100px] border border-main bg-dark py-1.5 pl-2.5 pr-3 text-font-2",
                currentMode === "chat" && "border-brand text-brand",
              )}
            >
              {characterProfileImage ? (
                <Image
                  src={characterProfileImage}
                  alt={characterChipText}
                  width={16}
                  height={16}
                  className="size-4 rounded-full object-cover"
                />
              ) : (
                <span className="size-4 rounded-full bg-font-2" aria-hidden />
              )}
              {characterChipText}
            </button>

            <button
              type="button"
              onClick={() => setCurrentMode("userChat")}
              className={cn(
                "body-4 flex h-8 items-center justify-center gap-1.5 rounded-[100px] border border-main bg-dark py-1.5 pl-2.5 pr-3 text-font-2",
                currentMode === "userChat" && "border-brand text-brand",
              )}
            >
              <User className="size-4 shrink-0" />
              {userChipText}
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertComposerText("{{user}}")}
                className="body-4 flex h-8 items-center px-2 py-1.5 text-font-2"
              >
                {"{{user}}"}
              </button>
              <button
                type="button"
                onClick={() => insertComposerText("{{img:}}")}
                className="body-4 flex h-8 items-center px-2 py-1.5 text-font-2"
              >
                {"{{img:}}"}
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
              <Upload className="size-6" />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default memo(CharacterPreview);
