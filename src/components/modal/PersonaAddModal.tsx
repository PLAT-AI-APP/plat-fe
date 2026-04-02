import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { ModalLayout } from "../ModalLayout";
import { Close, Persona } from "@/icons";
import SmartInput from "../SmartInput";

interface PersonaAddModalProps {
  toggleIsAddModal: () => void;
}

interface PersonaFormValues {
  name: string;
  info: string;
}

const PersonaAddModal = ({ toggleIsAddModal }: PersonaAddModalProps) => {
  const { control, handleSubmit } = useForm<PersonaFormValues>({
    defaultValues: {
      name: "",
      info: "",
    },
  });

  const onSubmit = useCallback(
    (data: PersonaFormValues) => {
      console.log("Persona Data:", data);
      toggleIsAddModal();
    },
    [toggleIsAddModal],
  );

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <Controller
            name="name"
            control={control}
            rules={{ required: true, maxLength: 20 }}
            render={({ field }) => (
              <SmartInput
                label="이름"
                value={field.value}
                onChange={field.onChange}
                required
                maxLength={20}
                placeholder="이름을 입력해주세요."
              />
            )}
          />
          <Controller
            name="info"
            control={control}
            rules={{ maxLength: 200 }}
            render={({ field }) => (
              <SmartInput
                label="정보"
                value={field.value}
                onChange={field.onChange}
                maxLength={200}
                minLine={4}
                maxLine={4}
                type="textarea"
                isBorder={true}
                inputClassName="max-h-30.25"
                placeholder={`나이, 성별 등을 자유롭게 입력해주세요.
2
3
4`}
              />
            )}
          />
        </div>

        <footer className="pt-9 font-medium">
          <button
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

export default React.memo(PersonaAddModal);
