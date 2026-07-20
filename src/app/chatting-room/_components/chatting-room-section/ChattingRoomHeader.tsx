"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Dots } from "@/icons";
import AiModelSelect from "@/components/chat/AiModeSelect";
import { AIModelType } from "@/type/chat";
import ChattingSidebar from "../ChattingSidebar";

interface ChattingRoomHeaderProps {
  characterName: string;
  currentAi: AIModelType;
  handleCurrentAi: (model: AIModelType) => void;
}

const ChattingRoomHeader = ({
  characterName,
  currentAi,
  handleCurrentAi,
}: ChattingRoomHeaderProps) => {
  const [isSidebar, setIsSidebar] = useState(false);

  const toggleIsSidebar = () => {
    // 채팅방 설정 사이드바 열림 상태
    setIsSidebar((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-bg-dark p-4">
      <h1 className="text-[20px] font-medium leading-[1.4] tracking-[-0.5px] text-font-1">
        {characterName}
      </h1>

      <div className="flex items-center gap-3">
        <AiModelSelect
          currentAi={currentAi}
          handleCurrentAi={handleCurrentAi}
        />

        <button
          type="button"
          onClick={toggleIsSidebar}
          className="flex size-8.5 items-center justify-center rounded-lg bg-btn-hover p-1.5 text-font-2 transition-colors hover:bg-btn-selected"
          aria-label="채팅방 설정 열기"
        >
          <Dots className="size-5.5" />
        </button>
      </div>

      {isSidebar &&
        typeof document !== "undefined" &&
        createPortal(
          <ChattingSidebar toggleIsSidebar={toggleIsSidebar} />,
          document.body,
        )}
    </header>
  );
};

export default ChattingRoomHeader;
