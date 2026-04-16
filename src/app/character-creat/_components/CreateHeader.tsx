"use client";

import React from "react";
import { Redo } from "@/icons";

interface CreateHeaderProps {
  onSave: () => void;
  onDraftClick: () => void;
}

const CreateHeader = ({ onSave, onDraftClick }: CreateHeaderProps) => {
  return (
    <header className="flex items-center justify-between pb-4">
      <h2 className="text-[20px] font-medium">캐릭터 생성</h2>

      <div className="flex gap-4 whitespace-nowrap">
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="px-5 py-2 bg-card border border-border-main rounded-xl hover:bg-card-hover"
          >
            임시저장
          </button>
          <button
            onClick={onDraftClick}
            className="flex items-center justify-center p-2 h-full aspect-square bg-card border border-border-main rounded-xl hover:bg-card-hover"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
        <button className="px-5 py-2 bg-brand rounded-xl">등록</button>
      </div>
    </header>
  );
};

export default CreateHeader;
