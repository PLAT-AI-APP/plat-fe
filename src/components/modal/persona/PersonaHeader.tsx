import React from "react";
import { Persona, Close } from "@/icons";

interface PersonaHeaderProps {
  onClose: () => void;
}

const PersonaHeader = ({ onClose }: PersonaHeaderProps) => {
  return (
    <header className="pb-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Persona className="w-6 h-6" />
          <h2 className="text-[20px] font-semibold">페르소나</h2>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-1 rounded-lg hover:bg-btn-hover"
          aria-label="닫기"
        >
          <Close className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-sm text-font-2 pt-2">
        페르소나로 설정한 역할에 맞춰 캐릭터와 대화할 수 있어요.
      </p>
    </header>
  );
};

export default PersonaHeader;
