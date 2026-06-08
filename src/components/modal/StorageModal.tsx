"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalLayout } from "../ModalLayout";
import { Close, Storage } from "@/icons";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";

import { StorageModalProps } from "@/type/modal";
import { storageFormSchema, StorageFormValues } from "@/schema/modal.schema";

const StorageModal = ({ onClose }: StorageModalProps) => {
  // useForm 초기화
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StorageFormValues>({
    resolver: zodResolver(storageFormSchema),
    defaultValues: {
      longTermMemory: "",
    },
  });

  // 실시간 값 감시 (저장 버튼 활성화용)
  const memoryValue = watch("longTermMemory");

  // 제출 핸들러
  const onSubmit = (data: StorageFormValues) => {
    console.log("장기기억 저장 데이터:", data);
    // API 호출 로직...
    onClose();
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-screen max-w-125 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5"
    >
      <header className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Storage className="w-6 h-6" />
            <h2 className="title-1">장기기억</h2>
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
        <p className="body-4 text-font-2 pt-2">
          대화내역이 자동으로 요약되어 캐릭터가 더 오래 기억할 수 있어요.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <SmartInput
          {...register("longTermMemory")}
          value={memoryValue}
          maxLength={2000}
          maxLine={12}
          minLine={12}
          type="textarea"
          isBorder={false}
          inputClassName="bg-card"
          inputBoxClassName="bg-card"
          placeholder={`장기기억이 생성되려면 더 많은 대화가 쌓여야 해요...`}
          error={errors.longTermMemory}
        />

        <div className="flex justify-end mt-9">
          <ActiveButton
            type="submit" // 제출 버튼으로 설정
            isActive={Boolean(memoryValue?.trim())} // 공백 제외 값이 있을 때만 활성화
            text="저장"
            className="rounded-xl w-25"
          />
        </div>
      </form>
    </ModalLayout>
  );
};

export default StorageModal;
