"use client";

import React, { memo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import AiModelSelect from "@/components/chat/AiModeSelect";
import { ArrowDown, Dots } from "@/icons";
import { AIModelType } from "@/type/chat";
import ChattingSidebar from "../ChattingSidebar";

interface ChattingRoomHeaderProps {
  roomId: string;
  characterName: string;
  models: AIModelType[];
  currentAi?: AIModelType;
  /** 세계관 상세를 아직 받는 중이라 캐릭터 이름을 모를 때. */
  isCharacterLoading?: boolean;
  /** 모델 목록을 아직 받는 중일 때. */
  isModelsLoading?: boolean;
  handleCurrentAi: (model: AIModelType) => void;
  isSuggestedReplyOn: boolean;
  onSuggestedReplyToggle: () => void;
}

const ChattingRoomHeader = ({
  roomId,
  characterName,
  models,
  currentAi,
  isCharacterLoading = false,
  isModelsLoading = false,
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

        {isCharacterLoading ? (
          <div aria-hidden="true" className="skeleton h-6 w-32 rounded-full" />
        ) : (
          <h1 className="title-1 min-w-0 truncate text-font-1">
            {characterName}
          </h1>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        {currentAi ? (
          <AiModelSelect
            models={models}
            currentAi={currentAi}
            handleCurrentAi={handleCurrentAi}
          />
        ) : (
          isModelsLoading && (
            // AiModelSelect 트리거(h-[34px] min-w-[108px] rounded-full)와 같은 크기.
            <div
              aria-hidden="true"
              className="skeleton h-[34px] w-[108px] rounded-full"
            />
          )
        )}

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
                roomId={roomId}
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

// 스트리밍 중 방 화면은 프레임마다 다시 그려진다. 헤더는 props 가 같으면 건너뛴다.
export default memo(ChattingRoomHeader);
