"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import AiModelSelect from "@/components/chat/AiModeSelect";
import { ArrowDown, Dots } from "@/icons";
import { AIModelType } from "@/type/chat";
import ChattingSidebar from "../ChattingSidebar";

interface ChattingRoomHeaderProps {
  characterName: string;
  currentAi: AIModelType;
  handleCurrentAi: (model: AIModelType) => void;
  isSuggestedReplyOn: boolean;
  onSuggestedReplyToggle: () => void;
}

const ChattingRoomHeader = ({
  characterName,
  currentAi,
  handleCurrentAi,
  isSuggestedReplyOn,
  onSuggestedReplyToggle,
}: ChattingRoomHeaderProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const router = useRouter();
  const [isSidebar, setIsSidebar] = useState(false);

  const toggleIsSidebar = () => {
    // 채팅방 설정 사이드바 열림 상태
    setIsSidebar((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-main bg-dark p-4">
      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 shrink-0 items-center justify-center text-font-2 transition-colors hover:text-font-1"
          aria-label={t("back")}
        >
          <ArrowDown className="size-6 rotate-90" />
        </button>

        <h1 className="title-1 min-w-0 truncate text-font-1">
          {characterName}
        </h1>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <AiModelSelect
          currentAi={currentAi}
          handleCurrentAi={handleCurrentAi}
        />

        <button
          type="button"
          onClick={toggleIsSidebar}
          className="flex size-8.5 items-center justify-center rounded-lg bg-btn-hover p-1.5 text-font-1 transition-colors hover:bg-btn-selected"
          aria-label={t("openSettings")}
        >
          <Dots className="size-5.5" />
        </button>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isSidebar && (
              <ChattingSidebar
                toggleIsSidebar={toggleIsSidebar}
                isSuggestedReplyOn={isSuggestedReplyOn}
                onSuggestedReplyToggle={onSuggestedReplyToggle}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
};

export default ChattingRoomHeader;
