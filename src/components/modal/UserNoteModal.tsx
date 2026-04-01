import React, { useState } from "react";
import SmartInput from "../SmartInput";
import { Close } from "@/icons";
import Note from "@/icons/Note";
import { ModalLayout } from "../ModalLayout";
import ActiveButton from "../ActiveButton";

interface UserNoteModalProps {
  closeModal: () => void;
}
const UserNoteModal = ({ closeModal }: UserNoteModalProps) => {
  const [text, setText] = useState("");
  const handleText = (text: string) => {
    setText(text);
  };
  return (
    <ModalLayout
      onClose={() => null}
      className="w-screen max-w-112.5 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5"
    >
      <header className="pb-6">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Note className="w-6 h-6" />
            <h2 className="text-[20px] font-semibold">유저노트</h2>
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

      <form className="w-full" onSubmit={(e) => e.stopPropagation()}>
        <SmartInput
          value={text}
          onChange={handleText}
          maxLength={500}
          inputClassName="bg-card border-none rounded-2xl pb-7.25 min-h-[165px]"
          type="textarea"
          maxLine={10}
          minLine={6}
          isBorder={false}
          placeholder={`잊으면 안되는 중요한 내용, 추가하고 싶은 설정 등
2
3
4
5
6 min line : 6, max line 10`}
        />
        <ActiveButton
          isActive={Boolean(text)}
          text="저장"
          className="rounded-xl w-25 mt-9 float-end"
        />
      </form>
    </ModalLayout>
  );
};

export default UserNoteModal;
