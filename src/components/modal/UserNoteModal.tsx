"use client";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { Close } from "@/icons";
import Note from "@/icons/Note";
import { ModalLayout } from "../ModalLayout";
import ActiveButton from "../ActiveButton";

import { UserNoteModalProps } from "@/type/modal";

// 폼 데이터 타입 정의
interface UserNoteFormValues {
  userNote: string;
}

const UserNoteModal = ({ onClose }: UserNoteModalProps) => {
  const { register, handleSubmit, control } = useForm<UserNoteFormValues>({
    defaultValues: {
      userNote: "",
    },
  });

  // 실시간 값 감시 (글자 수 표시 및 버튼 활성화용)
  const noteValue = useWatch({ control, name: "userNote" });

  // 제출 핸들러
  const onSubmit = (data: UserNoteFormValues) => {
    console.log("저장할 데이터:", data);
    // TODO: API 전송 로직
    onClose();
  };

  return (
    <ModalLayout
      onClose={onClose}
      className="w-screen max-w-112.5 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5"
    >
      <header className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Note className="w-6 h-6" />
            <h2 className="text-[20px] font-semibold">유저노트</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg hover:bg-btn-hover w-5.5 h-5.5"
            aria-label="닫기"
          >
            <Close className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-sm text-font-2 pt-2">
          대화내역이 자동으로 요약되어 캐릭터가 더 오래 기억할 수 있어요.
        </p>
      </header>

      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <SmartInput
          {...register("userNote", { required: true })}
          value={noteValue} // 실시간 글자 수 반영을 위해 watch 값 전달
          maxLength={500}
          inputClassName="bg-card border-none"
          inputBoxClassName="bg-card"
          type="textarea"
          maxLine={10}
          minLine={6}
          isBorder={false}
          placeholder={`잊으면 안되는 중요한 내용, 추가하고 싶은 설정 등\n...`}
        />
        <ActiveButton
          type="submit"
          isActive={Boolean(noteValue?.trim())} // 공백 제외 내용이 있을 때만 활성
          text="저장"
          className="rounded-xl w-25 mt-9 float-end"
        />
      </form>
    </ModalLayout>
  );
};

export default UserNoteModal;
