import SmartInput from "@/components/smart-input";
import { CharacterCreateFormValues } from "@/type/character";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

const DetailInfo = () => {
  const { register, control } = useFormContext<CharacterCreateFormValues>();

  const characterDetailSetting = useWatch({
    control,
    name: "characterDetailSetting",
  });

  return (
    <section className="flex flex-col gap-6">
      {/* 상세 설정 입력 영역 */}
      <article>
        <SmartInput
          label="캐릭터 상세 설정"
          maxLength={2000}
          type="textarea"
          description="세계관과 캐릭터의 성격, 말투, 외모 등 캐릭터 정보를 적어주세요."
          required
          maxLine={15}
          minLine={15}
          isBorder
          {...register("characterDetailSetting")}
          value={characterDetailSetting}
        />
      </article>
    </section>
  );
};

export default DetailInfo;
