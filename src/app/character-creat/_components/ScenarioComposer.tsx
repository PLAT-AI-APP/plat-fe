"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAutoResizeTextarea } from "@/hooks/form/useAutoResizeTextarea";
import { useTextareaSubmitShortcuts } from "@/hooks/form/useTextareaSubmitShortcuts";
import { Asterisk, Message, MoveUp, User } from "@/icons";
import { cn } from "@/lib/utils";
import { ScenarioType } from "@/type/character";

/** 입력폼 위쪽의 종류 선택 칩. 지금 고른 종류는 브랜드 색 테두리로 표시한다. */
const getModeChipClassName = (isActive: boolean) =>
  cn(
    "body-5 flex h-8 items-center justify-center gap-1.5 rounded-full border border-main bg-dark py-1.5 pl-2.5 pr-3 text-font-2",
    isActive && "border-brand text-brand",
  );

/** 오른쪽 아래 보조 버튼({{user}}·행동 표시). 디자인 기준 높이 34px */
const COMPOSER_TOOL_BUTTON_CLASS_NAME =
  "flex h-8.5 items-center justify-center rounded-lg px-2 py-1.5 text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1 disabled:pointer-events-none disabled:text-font-disabled";

interface ScenarioComposerProps {
  characterChipText: string;
  userChipText: string;
  characterProfileImage?: string | null;
  /** 입력한 한 줄을 시나리오 끝에 붙인다. */
  onSubmit: (type: ScenarioType, value: string) => void;
}

/**
 * 시나리오 미리보기 아래의 입력창.
 *
 * 예전에는 입력값 state 가 CharacterPreview 에 있어, 한 글자 칠 때마다 위의 대화 목록 전체
 * (드래그 항목·행동 구분 파싱 포함)가 다시 그려졌다. 대화가 길수록 타이핑이 무거워졌다.
 * 입력값을 여기 가두고, 보낼 때만 위로 올린다.
 */
const ScenarioComposer = ({
  characterChipText,
  userChipText,
  characterProfileImage,
  onSubmit,
}: ScenarioComposerProps) => {
  const t = useTranslations("characterCreate.preview");
  const [currentMode, setCurrentMode] = useState<ScenarioType>("chat");
  const [msg, setMsg] = useState("");
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea({
    maxRows: 5,
    value: msg,
  });

  const submitScenarioMessage = () => {
    if (!msg.trim()) return;

    onSubmit(currentMode, msg);
    setMsg("");
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
    // 고른 글자를 `*행동*` 으로 감싼다. 고른 게 없으면 별표 두 개만 넣고 그 사이에 커서를 둔다.
    const textarea = textareaRef.current;
    if (!textarea) {
      setMsg((prev) => `${prev}**`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = msg.substring(start, end);
    const selectionStart = start + 1;
    const selectionEnd = selectionStart + selectedText.length;

    setMsg(`${msg.substring(0, start)}*${selectedText}*${msg.substring(end)}`);

    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
      resizeTextarea();
    }, 0);
  };

  return (
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
              // `*행동*` 은 캐릭터 대사에서만 행동으로 구분해 그린다. 내레이터·사용자 입력에서는 그대로 글자로 남는다.
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
              "flex size-8.5 items-center justify-center rounded-full transition-colors",
              // 비활성일 때는 배경이 어두운 회색이라 브랜드 위 글자색(on-brand) 대신 font-1 로 화살표를 또렷하게 둔다.
              msg.trim()
                ? "bg-brand text-on-brand"
                : "bg-font-disabled text-font-1",
            )}
            aria-label={t("submitScenario")}
          >
            <MoveUp className="size-6" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default memo(ScenarioComposer);
