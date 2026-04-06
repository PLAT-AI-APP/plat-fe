import React, { useState } from "react"; // 1. useState 추가
import { ModalLayout } from "../ModalLayout";
import { Close, Global } from "@/icons"; // Check 아이콘이 있다고 가정
import { LANGUAGE_LIST } from "@/constants/language";
import ActiveButton from "../ActiveButton";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";

const AddLanguageModal = ({ onClose }: { onClose: () => void }) => {
  // 선택된 언어 코드들을 저장할 상태 (중복 선택을 위해 배열 사용)
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  // 언어 선택/해제 토글 함수
  const toggleLanguage = (code: string) => {
    setSelectedCodes(
      (prev) =>
        prev.includes(code)
          ? prev.filter((c) => c !== code) // 이미 있으면 제거
          : [...prev, code], // 없으면 추가
    );
  };

  return (
    <ModalLayout
      onClose={onClose}
      className="w-92.5 whitespace-nowrap p-5 border border-border-main rounded-3xl"
    >
      <header className="flex justify-between items-center">
        <div className="flex gap-3 font-semibold text-[20px]">
          <Global className="w-6 h-6" /> 언어추가
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 w-5.5 h-5.5 rounded-lg flex items-center justify-center hover:bg-btn-hover"
        >
          <Close className="w-3.5 h-3.5" />
        </button>
      </header>

      <ul className="flex flex-col gap-2.5 mt-6 mb-9">
        {LANGUAGE_LIST.map(({ code, eng, name }) => {
          // 현재 항목이 선택되었는지 확인
          const isSelected = selectedCodes.includes(code);

          return (
            <li
              key={code}
              onClick={() => toggleLanguage(code)} // 클릭 시 토글
              className={`flex gap-3 rounded-lg cursor-pointer p-2 ${
                isSelected ? "" : "hover:bg-btn-hover" // 선택 시 시각적 표시 (기존 클래스 활용)
              }`}
            >
              {/* 라디오 대신 체크 표시로 상태 표현 */}
              <div
                className={cn(
                  "w-5 h-5 border border-font-disabled rounded flex items-center justify-center",
                  isSelected && "bg-font-1",
                )}
              >
                <Check className="w-3.5 h-3.5 text-font-disabled" />
              </div>

              <div className="flex gap-1 items-center">
                <span className="text-sm">{name}</span>
                <span className="text-xs text-font-2">{eng}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* 하나 이상 선택되었을 때만 추가 버튼 활성화 */}
      <ActiveButton
        isActive={selectedCodes.length > 0}
        text="추가"
        onClick={() => {
          console.log("선택된 언어들:", selectedCodes);
          onClose();
        }}
        className="w-25 h-11.5 float-end"
      />
    </ModalLayout>
  );
};

export default AddLanguageModal;
