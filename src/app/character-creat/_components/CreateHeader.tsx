"use client";

import React from "react";
import { Redo } from "@/icons";
import ArrowLineLeft from "@/icons/ArrowLineLeft";
import ActiveButton from "@/components/ActiveButton";
import { useFormContext } from "react-hook-form";
import { CharacterCreateFormValues } from "@/type/character";
import { useRouter } from "next/navigation";

interface CreateHeaderProps {
  onSave: () => void;
  onDraftClick: () => void;
}

const CreateHeader = ({ onSave, onDraftClick }: CreateHeaderProps) => {
  const router = useRouter();

  const {
    formState: { isValid },
  } = useFormContext<CharacterCreateFormValues>();

  const handleSafeBack = (fallbackPath: string = "/") => {
    // 우리 사이트에서 이동 기록이 있다면 이전으로
    if (window.history.state.__next_navigation_guard_stack_index > 0) {
      router.back();
    }
    // 이전 경로가 우리 사이트가 아니라면 그냥 home으로
    else {
      router.push(fallbackPath);
    }
  };
  return (
    <header className="flex items-center justify-between pb-4">
      <h2 className="flex items-center gap-2 title-1">
        <ArrowLineLeft
          onClick={() => handleSafeBack("/")}
          className="w-6 h-6 text-font-2 cursor-pointer"
        />
        캐릭터 생성
      </h2>

      <div className="flex gap-4 whitespace-nowrap body-4">
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
        <ActiveButton
          isActive={isValid}
          text="등록"
          className="px-4 py-2 rounded-xl h-9"
        />
      </div>
    </header>
  );
};

export default CreateHeader;
