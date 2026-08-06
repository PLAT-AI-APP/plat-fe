"use client";

import React, {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { Asterisk, MoveUp } from "@/icons";
import ActiveButton from "../ActiveButton";

interface ChatFormProps {
  onSendMessage: (message: string) => void;
}

const TEXTAREA_LINE_HEIGHT = 21;
const TEXTAREA_MAX_ROWS = 5;
const TEXTAREA_VERTICAL_PADDING = 12;
const TEXTAREA_MAX_HEIGHT =
  TEXTAREA_LINE_HEIGHT * TEXTAREA_MAX_ROWS + TEXTAREA_VERTICAL_PADDING;

const ChatForm = ({ onSendMessage }: ChatFormProps) => {
  const t = useTranslations();
  const [msg, setMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMessage = msg.trim().length > 0;

  const syncTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, TEXTAREA_MAX_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > TEXTAREA_MAX_HEIGHT ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    syncTextareaHeight();
  }, [msg, syncTextareaHeight]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasMessage) return;
    // 입력값 전송 후 다음 입력을 위해 메시지 초기화
    onSendMessage(msg);
    setMsg("");
    requestAnimationFrame(syncTextareaHeight);
  };

  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();

    if (!hasMessage) return;

    onSendMessage(msg);
    setMsg("");
    requestAnimationFrame(syncTextareaHeight);
  };

  const handleSituationInsert = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = msg.slice(selectionStart, selectionEnd);
    const hasSelectedText = selectedText.length > 0;
    const nextMessage = hasSelectedText
      ? `${msg.slice(0, selectionStart)}*${selectedText}*${msg.slice(selectionEnd)}`
      : `${msg.slice(0, selectionStart)}**${msg.slice(selectionEnd)}`;
    const nextSelectionStart = selectionStart + 1;
    const nextSelectionEnd = hasSelectedText
      ? nextSelectionStart + selectedText.length
      : nextSelectionStart;

    // 선택된 텍스트가 있으면 감싸고, 없으면 별표 사이에 커서 배치
    setMsg(nextMessage);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    });
  };

  return (
    <form className="shrink-0" onSubmit={handleSubmit}>
      <fieldset
        id="chat-input-container"
        className="flex items-end gap-3 rounded-[28px] border border-bg-dark bg-bg-darker px-4 py-3"
      >
        <legend className="sr-only">{t("chatUI.messageForm")}</legend>

        <textarea
          ref={textareaRef}
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
          onKeyDown={handleTextareaKeyDown}
          placeholder={t("chatUI.messagePlaceholder")}
          rows={1}
          className="body-4 min-h-[21px] flex-1 resize-none bg-transparent py-1.5 text-font-1 outline-none placeholder:text-font-disabled"
        />

        <footer className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleSituationInsert}
            className="body-4 flex h-8 items-center justify-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3 text-font-2 transition-colors hover:bg-btn-hover"
          >
            <Asterisk className="size-4" />
            {t("chatUI.situation")}
          </button>

          <ActiveButton
            isActive
            text=""
            type="submit"
            className="flex size-8.5 items-center justify-center rounded-full p-0"
          >
            <MoveUp className="size-6 text-white" />
          </ActiveButton>
        </footer>
      </fieldset>
    </form>
  );
};

export default ChatForm;
