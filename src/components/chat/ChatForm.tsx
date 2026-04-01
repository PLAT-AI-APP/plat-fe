"use client";
import { PenSparkle, SendFill } from "@/icons";
import { AIModelType } from "@/type/chat";
import React, { useCallback, useState } from "react";
import ActiveButton from "../ActiveButton";
import AiModelSelect from "./AiModeSelect";

const ChatForm = () => {
  const [currentAi, setCurrentAi] = useState<AIModelType>({
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    description: "향상된 성능과 표현력을 갖춘 최신 AI 모델",
    price: 1.2,
    unit: "채팅",
    icon: "/ai-logo/chatgpt.png",
  });
  const [msg, setMsg] = useState("");

  const handleCurrentAi = useCallback((model: AIModelType) => {
    setCurrentAi(model);
  }, []);

  const handleMsg = (text: string) => {
    setMsg(text);
  };

  return (
    <form className="max-h-30">
      <fieldset
        id="chat-input-container"
        className="flex flex-col p-3 pt-5 border border-border-main rounded-4xl bg-[#171D28]/50"
      >
        <legend className="sr-only">메시지 입력 양식</legend>

        <textarea
          value={msg}
          onChange={(e) => handleMsg(e.target.value)}
          placeholder="메시지 보내기"
          className="flex-1 items-start text-font-1 text-sm placeholder:text-font-disabled focus:border-none focus:outline-0"
        />

        <footer className="flex justify-between">
          <div className="flex gap-3">
            <AiModelSelect
              currentAi={currentAi}
              handleCurrentAi={handleCurrentAi}
            />
            <button
              type="button"
              className="hover:bg-btn-hover rounded-full border border-border-main aspect-square"
            >
              <PenSparkle className="text-font-2 w-[18.7px] h-[18.7px] mx-auto" />
            </button>
          </div>

          <ActiveButton
            isActive={msg.length > 0}
            text=""
            type="submit"
            className="w-8.5 h-8.5 flex items-center justify-center rounded-full"
          >
            <SendFill className="w-4.5 h-4.5" />
          </ActiveButton>
        </footer>
      </fieldset>
    </form>
  );
};

export default ChatForm;
