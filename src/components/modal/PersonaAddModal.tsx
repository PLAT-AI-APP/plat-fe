"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { ModalLayout } from "../ModalLayout";
import { Close, Persona } from "@/icons";
import SmartInput from "../SmartInput";
import { useAddPersonaMutation } from "@/api/persona/addPersona";

interface PersonaAddModalProps {
  toggleIsAddModal: () => void;
}

interface PersonaFormValues {
  name: string;
  info: string;
}

const PersonaAddModal = ({ toggleIsAddModal }: PersonaAddModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<PersonaFormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      info: "",
    },
  });

  const { mutate: addPersona } = useAddPersonaMutation();

  const { info, name } = watch();

  const onSubmit = (data: PersonaFormValues) => {
    console.log("Persona Data:", data);
    addPersona({ description: info, name });
    toggleIsAddModal();
  };

  return (
    <ModalLayout
      onClose={toggleIsAddModal} // 모달 외부 클릭 시 닫기
      className="z-30 w-screen max-w-100 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-bg-dark border border-border-main rounded-3xl"
    >
      <header className="pb-6">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Persona className="w-6 h-6" />
            <h2 className="text-[20px] font-semibold text-font-1">페르소나</h2>
          </div>
          <button
            onClick={toggleIsAddModal}
            type="button"
            className="p-1 rounded-lg hover:bg-btn-hover transition-colors"
            aria-label="닫기"
          >
            <Close className="w-3.5 h-3.5 text-font-2" />
          </button>
        </div>
        <p className="text-sm text-font-2 pt-2 whitespace-normal">
          페르소나로 설정한 역할에 맞춰 캐릭터와 대화할 수 있어요.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {/* 3. register 직접 적용 (Ref 포워딩 활용) */}
          <SmartInput
            label="이름"
            required
            maxLength={20}
            placeholder="이름을 입력해주세요."
            value={name} // 글자 수 표시용
            {...register("name", { required: true, maxLength: 20 })}
          />

          <SmartInput
            label="정보"
            maxLength={200}
            minLine={4}
            maxLine={4}
            type="textarea"
            isBorder={true}
            inputClassName="max-h-30.25"
            placeholder={`나이, 성별 등을 자유롭게 입력해주세요.\n...`}
            value={info} // 글자 수 표시용
            {...register("info", { maxLength: 200 })}
          />
        </div>

        <footer className="pt-9 font-medium">
          <button
            type="submit"
            disabled={!isValid} // 필수값이 없거나 에러 시 비활성화
            className={`py-3 w-full rounded-xl border transition-all
              ${
                isValid
                  ? "bg-brand text-white border-transparent hover:brightness-110"
                  : "bg-bg-darkest text-font-disabled border-border-main cursor-not-allowed"
              }`}
          >
            페르소나 추가
          </button>
        </footer>
      </form>
    </ModalLayout>
  );
};

export default React.memo(PersonaAddModal);
