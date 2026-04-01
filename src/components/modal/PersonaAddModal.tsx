import React, { useState } from "react";
import { ModalLayout } from "../ModalLayout";
import { Close, Persona } from "@/icons";
import SmartInput from "../SmartInput";

interface PersonaAddModalProps {
  toggleIsAddModal: () => void;
}
const PersonaAddModal = ({ toggleIsAddModal }: PersonaAddModalProps) => {
  const [name, setName] = useState("");
  const handleName = (text: string) => {
    setName(text);
  };
  const [info, setInfo] = useState("");
  const handleinfo = (text: string) => {
    setInfo(text);
  };
  return (
    <ModalLayout
      onClose={() => null}
      className="z-30 w-screen max-w-100 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-bg-dark"
    >
      <header className="pb-6">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Persona className="w-6 h-6" />
            <h2 className="text-[20px] font-semibold">페르소나</h2>
          </div>
          <button
            onClick={toggleIsAddModal}
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

      <form
        onSubmit={(e) => {
          e.stopPropagation();
          toggleIsAddModal();
        }}
      >
        <div className="flex flex-col gap-6">
          <SmartInput
            label="이름"
            value={name}
            required
            maxLength={20}
            onChange={handleName}
            placeholder="이름을 입력해주세요."
          />
          <SmartInput
            label="정보"
            value={info}
            maxLength={200}
            minLine={4}
            maxLine={4}
            onChange={handleinfo}
            type="textarea"
            isBorder={true}
            inputClassName="max-h-30.25"
            placeholder={`나이, 성별 등을 자유롭게 입력해주세요.
2
3
4`}
          />
        </div>

        <footer className="pt-9 font-medium">
          <button
            onSubmit={toggleIsAddModal}
            type="submit"
            className="py-3 w-full rounded-xl bg-bg-darkest border border-border-main hover:bg-btn-hover"
          >
            페르소나 추가
          </button>
        </footer>
      </form>
    </ModalLayout>
  );
};

export default PersonaAddModal;
