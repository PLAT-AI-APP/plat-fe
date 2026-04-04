import SmartInput from "@/components/SmartInput";
import { CharacterCreateFormValues } from "@/type/character";
import React from "react";
import { useFormContext } from "react-hook-form";

const DetailInfo = () => {
  const { register, watch } = useFormContext<CharacterCreateFormValues>();

  // 상태 및 데이터 관찰
  const heightValue = watch("height");
  const weightValue = watch("weight");

  return (
    <section className="flex flex-col gap-6">
      {/* 신체 정보 입력 영역 */}
      <div id="physical-info-container" className="flex gap-6">
        <SmartInput
          label="키"
          maxLength={10}
          placeholder="예) 168cm"
          isBorder
          {...register("height")}
          value={heightValue}
          className="gap-2"
        />
        <SmartInput
          label="몸무게"
          maxLength={10}
          placeholder="예) 48kg"
          isBorder
          {...register("weight")}
          value={weightValue}
          className="gap-2"
        />
      </div>

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
          placeholder="예) 48kg"
          isBorder
          {...register("weight")}
          value={weightValue}
          className="gap-2"
        />
      </article>
    </section>
  );
};

export default DetailInfo;
