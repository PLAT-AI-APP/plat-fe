"use client";

import React, { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, Asterisk } from "@/icons";
import { cn } from "@/lib/utils";
import ActiveButton from "../ActiveButton";

interface ChatFormProps {
  onSendMessage: (message: string) => void;
}

const ChatForm = ({ onSendMessage }: ChatFormProps) => {
  const t = useTranslations();
  const [msg, setMsg] = useState("");
  const hasMessage = msg.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasMessage) return;

    // 입력 후 바로 다음 대화를 준비하는 메시지 전송 흐름
    onSendMessage(msg);
    setMsg("");
  };

  return (
    <form className="shrink-0" onSubmit={handleSubmit}>
      <fieldset
        id="chat-input-container"
        className="flex flex-col rounded-[28px] border border-bg-dark bg-bg-darker px-4 pb-4 pt-5"
      >
        <legend className="sr-only">{t("chatUI.messageForm")}</legend>

        <textarea
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
          placeholder={t("chatUI.messagePlaceholder")}
          className="body-4 min-h-10 resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
        />

        <footer className="flex justify-end gap-3">
          <button
            type="button"
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
            <ArrowUp className="size-6" />
          </ActiveButton>
        </footer>
      </fieldset>
    </form>
  );
};

export default ChatForm;
