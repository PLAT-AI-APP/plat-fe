"use client";
import React, { useState } from "react";
import { ArrowLeft, Dots } from "@/icons";
import ChattingSidebar from "../ChattingSidebar";
import { createPortal } from "react-dom";

interface ChattingRoomHeaderProps {
  characterName: string;
  onBack?: () => void;
}

const ChattingRoomHeader = ({
  characterName,
  onBack,
}: ChattingRoomHeaderProps) => {
  const [isSidebar, setIsSidebar] = useState(false);
  const toggleIsSidebar = () => {
    setIsSidebar(!isSidebar);
  };
  return (
    <header className="flex justify-between sticky top-0 bg-bg-dark z-10">
      <button
        onClick={onBack}
        className="flex items-center gap-6.25 text-[26px] font-semibold"
      >
        <ArrowLeft className="w-7 h-7" />
        {characterName}
      </button>
      <button
        onClick={toggleIsSidebar}
        className="flex items-center justify-center w-8.5 h-8.5 rounded-lg hover:bg-btn-hover transition-colors"
      >
        <Dots />
      </button>
      {/* 구조는 그대로 두되, 실제 렌더링 위치만 document.body로 */}
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
