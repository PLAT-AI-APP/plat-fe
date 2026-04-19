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
    // 브라우저 세션 히스토리에 쌓인 페이지가 1개보다 많고,
    // 이전 주소가 우리 서비스 도메인일 때만 뒤로 가기 수행
    const isInternalNavigation = document.referrer.includes(
      window.location.host,
    );
    const hasHistory = window.history.length > 1;

    if (isInternalNavigation && hasHistory) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };
  return (
    <header className="flex items-center justify-between pb-4">
      <h2 className="flex items-center gap-2 text-[20px] font-medium">
        <ArrowLineLeft
          onClick={() => handleSafeBack("/")}
          className="w-6 h-6 text-font-2 cursor-pointer"
        />
        캐릭터 생성
      </h2>

      <div className="flex gap-4 whitespace-nowrap text-sm">
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
          className="px-4 py-2 rounded-xl font-medium h-9"
        />
      </div>
    </header>
  );
};

export default CreateHeader;
