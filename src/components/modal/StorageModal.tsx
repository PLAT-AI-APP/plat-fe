import React, { useState } from "react";
import { ModalLayout } from "../ModalLayout";
import { Close, Storage } from "@/icons";
import ActiveButton from "../ActiveButton";
import SmartInput from "../SmartInput";

interface StorageModalProps {
  closeModal: () => void;
}

const StorageModal = ({ closeModal }: StorageModalProps) => {
  const [text, setText] = useState("");

  const handleTextChange = (text: string) => {
    setText(text);
  };

  return (
    <ModalLayout
      onClose={() => null}
      className="w-screen max-w-125 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5"
    >
      <header className="pb-6">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Storage className="w-6 h-6" />
            <h2 className="text-[20px] font-semibold">장기기억</h2>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="p-1 rounded-lg hover:bg-btn-hover"
            aria-label="닫기"
          >
            <Close className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-sm text-font-2 pt-2">
          대화내역이 자동으로 요약되어 캐릭터가 더 오래 기억할 수 있어요.
        </p>
      </header>

      <form className="w-full">
        <SmartInput
          maxLength={2000}
          maxLine={12}
          minLine={12}
          value={text}
          onChange={handleTextChange}
          type="textarea"
          isBorder={false}
          inputClassName="pb-7.25 bg-card rounded-2xl"
          placeholder={`장기기억이 생성되려면 더 많은 대화가 쌓여야 해요.
2
3
4
5
6
7
8
9
10
11
12`}
        />
      </form>

      <ActiveButton
        isActive={Boolean(text)}
        text="저장"
        className="rounded-xl w-25 mt-9 float-end"
      />
    </ModalLayout>
  );
};

export default StorageModal;
