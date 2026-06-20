"use client";

import React, { memo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import ActiveButton from "@/components/ActiveButton";
import CreatePreviewList from "./create-preview-list";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { Asterisk, ImageIcon, SendFill } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { ScenarioContentItem, ScenarioType } from "@/type/character";

interface CharacterPreviewProps {
  activeScenarioIndex: number;
}

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
  const characterName = name || t("defaultCharacterName");
  const scenarioName = scenarios?.[activeScenarioIndex]?.name;
  const contents = scenarios?.[activeScenarioIndex]?.contents || [];
  const hasRepresentativeImage = Boolean(representativeImage);
  const hasCharacterName = Boolean(name?.trim());
  const canEditScenario = hasRepresentativeImage && hasCharacterName;
  const [currentMode, setCurrentMode] = useState<ScenarioType>("chat");
  const [msg, setMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isScrolling, onScroll } = useScrollTimeout();

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
    setValue(`scenarios.${activeScenarioIndex}.contents`, updatedContents, {
      shouldValidate: true,
    });
  };

  const handleDeleteContent = (id: string) => {
    const updatedContents = contents.filter((item) => item.id !== id);
    setValue(`scenarios.${activeScenarioIndex}.contents`, updatedContents, {
      shouldValidate: true,
    });
  };

  const handleReorderContents = (newContents: ScenarioContentItem[]) => {
    setValue(`scenarios.${activeScenarioIndex}.contents`, newContents, {
      shouldValidate: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditScenario || !msg.trim()) return;

    const newContent = {
      id: String(Date.now()),
      type: currentMode,
      value: msg,
    };

    const currentContents =
      getValues(`scenarios.${activeScenarioIndex}.contents`) || [];
    setValue(
      `scenarios.${activeScenarioIndex}.contents`,
      [...currentContents, newContent],
      { shouldValidate: true },
    );
    setMsg("");

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const handleInsertUserToken = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const token = "{{user}}";
    const text = msg;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = `${before}${token}${after}`;

    setMsg(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + token.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <section className="flex h-[919px] w-[693px] shrink-0 flex-col justify-between rounded-3xl bg-bg-darker p-4">
      <div className="mb-6 flex shrink-0 flex-col gap-2 rounded-2xl bg-bg-darkest px-4 py-3">
        <div className="flex items-end gap-1.5">
          <strong className="body-2 text-font-1">
            {scenarioName ||
              t("scenarioFallback", { index: activeScenarioIndex + 1 })}
          </strong>
          <span className="body-5 text-font-disabled">{t("scenarioEdit")}</span>
        </div>
        <p className="body-6 text-font-2">{t("scenarioGuide")}</p>
      </div>

      <div
        onScroll={onScroll}
        ref={scrollContainerRef}
        className={cn(
          "custom-scrollbar hide-scrollbar-on-idle min-h-0 flex-1 overflow-y-auto px-2",
          isScrolling && "is-scrolling",
        )}
      >
        {canEditScenario ? (
          <CreatePreviewList
            contents={contents}
            characterName={characterName}
            profileImage={representativeImage}
            isEditable
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
            onReorder={handleReorderContents}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
            <div className="body-3 flex flex-col text-font-2">
              <p>{t("requirementTitle")}</p>
              <p>{t("requirementSubtitle")}</p>
            </div>

            {/* 시나리오 작성 가능 여부를 사용자가 바로 확인할 수 있게 최소 조건을 노출합니다. */}
            <div className="flex w-[336px] flex-col gap-5 rounded-3xl bg-bg-darkest px-5 py-6 text-left">
              <p className="body-5 text-font-2">{t("requirementGuide")}</p>
              <ul className="flex flex-col gap-3 pl-[68px]">
                <li className="body-5 flex items-center gap-2 text-font-1">
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-sm border",
                      hasRepresentativeImage
                        ? "border-font-1 bg-font-1 text-bg-darkest"
                        : "border-font-2 text-font-2",
                    )}
                    aria-hidden="true"
                  >
                    {hasRepresentativeImage && <Check className="size-2.5" />}
                  </span>
                  {t("representativeImageReady")}
                </li>
                <li className="body-5 flex items-center gap-2 text-font-1">
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-sm border",
                      hasCharacterName
                        ? "border-font-1 bg-font-1 text-bg-darkest"
                        : "border-font-2 text-font-2",
                    )}
                    aria-hidden="true"
                  >
                    {hasCharacterName && <Check className="size-2.5" />}
                  </span>
                  {t("characterNameReady")}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-1.75 shrink-0 rounded-4xl border border-bg-dark bg-bg-darkest p-4 pb-3"
      >
        <textarea
          rows={2}
          ref={textareaRef}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          disabled={!canEditScenario}
          placeholder={
            canEditScenario
              ? t("messagePlaceholder")
              : t("requirementInputPlaceholder")
          }
          className="mb-2 w-full bg-transparent text-sm outline-none placeholder:text-font-disabled"
        />

        <div className="flex justify-between">
          <div className="flex gap-2 text-sm text-font-2">
            {!canEditScenario && (
              <>
                <button
                  type="button"
                  disabled
                  className="body-4 flex items-center gap-1.5 rounded-[100px] border border-border-main py-1.5 pl-2.5 pr-3 text-font-disabled"
                >
                  {t("narrator")}
                </button>
                <button
                  type="button"
                  disabled
                  className="body-4 flex items-center gap-1.5 rounded-[100px] border border-border-main py-1.5 pl-2.5 pr-3 text-font-disabled"
                >
                  <span className="size-4 rounded-full bg-font-disabled" />
                  {t("characterNameChip")}
                </button>
                <button
                  type="button"
                  disabled
                  className="body-4 flex items-center gap-1.5 rounded-[100px] border border-border-main py-1.5 pl-2.5 pr-3 text-font-disabled"
                >
                  {`{user}`}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => handleCurrentMode("action")}
              className={cn(
                "flex items-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3",
                !canEditScenario &&
                  "border-transparent bg-transparent text-font-disabled",
                currentMode === "action" && "border-brand text-brand",
              )}
              disabled={!canEditScenario}
            >
              <Asterisk className="h-4 w-4" />
              {t("action")}
            </button>
            <button
              type="button"
              onClick={() => handleCurrentMode("asset")}
              className={cn(
                "flex items-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3",
                !canEditScenario &&
                  "border-transparent bg-transparent text-font-disabled",
                currentMode === "asset" && "border-brand text-brand",
              )}
              disabled={!canEditScenario}
            >
              <ImageIcon className="h-4 w-4" />
              {t("asset")}
            </button>
            {canEditScenario && (
              <button
                type="button"
                onClick={handleInsertUserToken}
                className="flex items-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3"
              >
                {`{user}`}
              </button>
            )}
          </div>

          <ActiveButton
            isActive={canEditScenario && msg.length > 0}
            text=""
            type="submit"
            className={cn(
              "flex h-8.5 w-8.5 items-center justify-center rounded-full",
              !canEditScenario && "bg-font-disabled text-font-2",
            )}
          >
            <SendFill className="h-4.5 w-4.5" />
          </ActiveButton>
        </div>
      </form>
    </section>
  );
};

export default memo(CharacterPreview);
