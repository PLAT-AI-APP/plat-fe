"use client";

import React, { FormEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Asterisk, MoveUp } from "@/icons";
import { cn } from "@/lib/utils";
import ActiveButton from "../ActiveButton";

interface ChatFormProps {
  onSendMessage: (message: string) => void;
}

const ChatForm = ({ onSendMessage }: ChatFormProps) => {
  const t = useTranslations();
  const [msg, setMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMessage = msg.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasMessage) return;

    // 입력 후 바로 다음 대화를 준비하는 메시지 전송 흐름
    onSendMessage(msg);
    setMsg("");
  };

  const handleSituationInsert = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const nextMessage = `${msg.slice(0, selectionStart)}**${msg.slice(selectionEnd)}`;
    const nextCursorPosition = selectionStart + 1;

    // 별표 사이에 커서를 두는 상황 입력 토큰
    setMsg(nextMessage);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  };

  return (
    <form className="shrink-0" onSubmit={handleSubmit}>
      <fieldset
        id="chat-input-container"
        className="flex flex-col gap-6 rounded-[28px] border border-bg-dark bg-bg-darker px-4 pb-4 pt-5"
      >
        <legend className="sr-only">{t("chatUI.messageForm")}</legend>

        <textarea
          ref={textareaRef}
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
          placeholder={t("chatUI.messagePlaceholder")}
          className="body-4 min-h-5 resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
        />

        <footer className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSituationInsert}
            className="body-4 flex h-8 items-center justify-center gap-1.5 rounded-[100px] border border-border-main bg-[#171D28]/50 py-1.5 pl-2.5 pr-3 text-font-2 transition-colors hover:bg-btn-hover"
          >
            <Asterisk className="size-4" />
            {t("chatUI.situation")}
          </button>

          <ActiveButton
            isActive={hasMessage}
            text=""
            type="submit"
            className={cn(
              "flex size-8.5 items-center justify-center rounded-full p-0",
              !hasMessage && "bg-font-disabled text-font-4",
            )}
          >
            <MoveUp className="size-6 text-white" />
          </ActiveButton>
        </footer>
      </fieldset>
    </form>
  );
};

export default ChatForm;
