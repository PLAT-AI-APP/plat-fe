"use client";

import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Asterisk, PenSparkle, SendFill } from "@/icons";
import { AIModelType } from "@/type/chat";
import ActiveButton from "../ActiveButton";
import AiModelSelect from "./AiModeSelect";

const ChatForm = () => {
  const t = useTranslations();
  const [currentAi, setCurrentAi] = useState<AIModelType>({
    id: "Gemini 3.1 Pro",
    name: "3.1 Pro",
    description: "향상된 성능과 표현력을 갖춘 최신 AI 모델",
    price: 1.2,
    unit: t("chatUI.perChat"),
    icon: "/ai-logo/gemini.png",
  });
  const [msg, setMsg] = useState("");

  const handleCurrentAi = useCallback((model: AIModelType) => {
    setCurrentAi(model);
  }, []);

  return (
    <form className="max-h-30">
      <fieldset
        id="chat-input-container"
        className="flex flex-col rounded-4xl border border-border-main bg-[#171D28]/50 p-3 pt-5"
      >
        <legend className="sr-only">{t("chatUI.messageForm")}</legend>

        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder={t("chatUI.messagePlaceholder")}
          className="body-4 flex-1 items-start text-font-1 placeholder:text-font-disabled focus:border-none focus:outline-0"
        />

        <footer className="flex justify-between">
          <div className="flex gap-3">
            <AiModelSelect
              currentAi={currentAi}
              handleCurrentAi={handleCurrentAi}
            />
            <button
              type="button"
              className="body-4 flex h-fit items-center justify-center gap-1.5 rounded-[100px] border border-border-main py-1.5 pl-2.5 pr-3 text-font-2 hover:bg-btn-hover"
            >
              <Asterisk className="h-4 w-4" />
              {t("chatUI.situation")}
            </button>
            <button
              type="button"
              className="body-4 flex items-center justify-center gap-2.5 rounded-[100px] border border-border-main py-1.5 pl-2.5 pr-3 text-font-2 hover:bg-btn-hover"
            >
              <PenSparkle className="mx-auto h-4 w-4" />
              {t("chatUI.suggestedReply")}
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
        </footer>
      </fieldset>
    </form>
  );
};

export default ChatForm;
