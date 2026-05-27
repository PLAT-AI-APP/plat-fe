"use client";

import React from "react";
import { Redo } from "@/icons";
import ArrowLineLeft from "@/icons/ArrowLineLeft";
import ActiveButton from "@/components/ActiveButton";
import { useFormContext } from "react-hook-form";
import { CharacterCreateFormValues } from "@/type/character";
import { useRouter } from "next/navigation";
import { useChatacterCreateMutation } from "@/api/character/postChatacterCreate";

interface CreateHeaderProps {
  onSave: () => void;
  onDraftClick: () => void;
}

const CreateHeader = ({ onSave, onDraftClick }: CreateHeaderProps) => {
  const router = useRouter();

  const {
    formState: { isValid },
    getValues,
  } = useFormContext<CharacterCreateFormValues>();

  const { mutate, isPending } = useChatacterCreateMutation();

  const handleSafeBack = (fallbackPath: string = "/") => {
    if (window.history.state.__next_navigation_guard_stack_index > 0) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  // 데이터 가공 및 전송 로직
  const handleRegisterClick = () => {
    // 폼이 유효하지 않으면 전송 방지 (테스트 끝나면 주석 해제하세요)
    // if (!isValid) return;

    const currentFormData = getValues();

    // RHF 데이터 -> API 스펙으로 매핑(Mapping)
    const payload = {
      profileImage: currentFormData.representativeImage,
      name: currentFormData.name,
      introduce: currentFormData.characterIntroduce,
      detailSetting: currentFormData.characterDetailSetting,

      assets:
        currentFormData.asset?.map((a) => ({
          name: a.assetName,
          situation: a.assetSituation,
          image: a.assetImage,
        })) || [],

      visibility: currentFormData.isPublic ? "PUBLIC" : "PRIVATE",

      description: currentFormData.characterDescription,
      tendency: currentFormData.tendency,
      tagIds: currentFormData.tagIds.map((tag) => tag.id),
    };

    console.log("서버로 전송될 페이로드:", payload);

    mutate(
      { props: payload },
      {
        onSuccess: () => {
          alert("캐릭터가 성공적으로 등록되었습니다!");
          router.push("/"); // 완료 후 홈이나 디테일 페이지로 이동
        },
        onError: (error) => {
          console.error("캐릭터 등록 실패:", error);
          alert("캐릭터 등록에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
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
          // API 통신 중(isPending)일 때는 버튼을 비활성화하여 중복 클릭(따닥) 방지
          // isActive={isValid && !isPending}
          isActive
          text={isPending ? "등록 중..." : "등록"}
          className="px-4 py-2 rounded-xl h-9"
          onClick={handleRegisterClick}
        />
      </div>
    </header>
  );
};

export default CreateHeader;
