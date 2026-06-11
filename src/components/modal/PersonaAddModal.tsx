"use client";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalLayout } from "../ModalLayout";
import { Close, Persona } from "@/icons";
import SmartInput from "@/components/smart-input";
import { useAddPersonaMutation } from "@/api/persona/addPersona";
import { useEditPersonaMutation } from "@/api/persona/editPersona";
import { useDetailPersonaQuery } from "@/api/persona/detailPersons";

import { PersonaAddModalProps } from "@/type/modal";
import { personaFormSchema, PersonaFormValues } from "@/schema/modal.schema";

const PersonaAddModal = ({
  onClose,
  isEditMode = false,
  personaId,
  name: initialName,
  description: initialDescription,
}: PersonaAddModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<PersonaFormValues>({
    mode: "onChange",
    resolver: zodResolver(personaFormSchema),
    defaultValues: {
      name: "",
      info: "",
    },
  });

  const { data: personaDetail } = useDetailPersonaQuery(personaId as string, {
    enabled: isEditMode && !!personaId,
  });

  useEffect(() => {
    if (isEditMode && (initialName || initialDescription)) {
      reset({
        name: initialName ?? "",
        info: initialDescription ?? "",
      });
      return;
    }

    if (isEditMode && personaDetail) {
      reset({
        name: personaDetail.name,
        info: personaDetail.description,
      });
    }
  }, [initialDescription, initialName, isEditMode, personaDetail, reset]);

  const { mutate: addPersona } = useAddPersonaMutation();
  const { mutate: editPersona } = useEditPersonaMutation();

  const name = useWatch({ control, name: "name" }) ?? "";
  const info = useWatch({ control, name: "info" }) ?? "";

  const onSubmit = () => {
    if (isEditMode && personaId) {
      editPersona({ personaId, description: info, name });
    } else {
      addPersona({ description: info, name });
    }
    onClose();
  };

  return (
    <ModalLayout
      hasBackground
      onClose={onClose} // 모달 외부 클릭 시 닫기
      className="w-screen max-w-125 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-bg-dark border border-border-main rounded-3xl"
    >
      <header className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Persona className="w-6 h-6" />
            <h2 className="title-1 text-font-1">
              페르소나 {isEditMode ? "수정" : "추가"}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg hover:bg-btn-hover transition-colors w-5.5 h-5.5"
            aria-label="닫기"
          >
            <Close className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="body-4 text-font-2 pt-2 whitespace-normal">
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
            error={errors.name ? "" : undefined}
            {...register("name")}
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
            error={errors.info ? "" : undefined}
            {...register("info")}
            showOptionalLabel
          />
        </div>

        <footer className="pt-9">
          <button
            type="submit"
            disabled={!isValid} // 필수값이 없거나 에러 시 비활성화
            className={`mt-3 py-3 w-full title-3 rounded-xl transition-colors ${
              !isValid
                ? "bg-card text-font-disabled"
                : "text-brand-dark bg-brand/10 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "저장하기" : "추가하기"}
          </button>
        </footer>
      </form>
    </ModalLayout>
  );
};

export default React.memo(PersonaAddModal);
