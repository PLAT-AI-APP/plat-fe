"use client";

import React, { memo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import ActiveButton from "@/components/ActiveButton";
import CreatePreviewList from "./CreatePreviewList";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { Asterisk, ImageIcon, SendFill } from "@/icons";
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
  // 미입력 상태의 이름도 샘플 콘텐츠 성격이므로 번역 키 대신 고정값으로 유지합니다.
  const characterName = name || "캐릭터";
  const contents = scenarios?.[activeScenarioIndex]?.contents || [];
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
    if (!msg.trim()) return;

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
    <section className="flex flex-1 flex-col justify-between">
      <div
        onScroll={onScroll}
        ref={scrollContainerRef}
        className={cn(
          "custom-scrollbar hide-scrollbar-on-idle flex-1 overflow-y-auto px-4",
          isScrolling && "is-scrolling",
        )}
      >
        <CreatePreviewList
          contents={contents}
          characterName={characterName}
          profileImage="/images/sample.png"
          isEditable
          onUpdate={handleUpdateContent}
          onDelete={handleDeleteContent}
          onReorder={handleReorderContents}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-1.75 shrink-0 rounded-4xl border border-border-main bg-bg-darkest p-4 pb-3"
      >
        <textarea
          rows={2}
          ref={textareaRef}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className="mb-2 w-full bg-transparent text-sm outline-none placeholder:text-font-disabled"
        />

        <div className="flex justify-between">
          <div className="flex gap-2 text-sm text-font-2">
            <button
              type="button"
              onClick={() => handleCurrentMode("action")}
              className={cn(
                "flex items-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3",
                currentMode === "action" && "border-brand text-brand",
              )}
            >
              <Asterisk className="h-4 w-4" />
              {t("action")}
            </button>
            <button
              type="button"
              onClick={() => handleCurrentMode("asset")}
              className={cn(
                "flex items-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3",
                currentMode === "asset" && "border-brand text-brand",
              )}
            >
              <ImageIcon className="h-4 w-4" />
              {t("asset")}
            </button>
            <button
              type="button"
              onClick={handleInsertUserToken}
              className="flex items-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3"
            >
              {`{user}`}
            </button>
          </div>

          <ActiveButton
            isActive={msg.length > 0}
            text=""
            type="submit"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full"
          >
            <SendFill className="h-4.5 w-4.5" />
          </ActiveButton>
        </div>
      </form>
    </section>
  );
};

export default memo(CharacterPreview);
