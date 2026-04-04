import React from "react";
import { useFormContext } from "react-hook-form";
import RepresentativeImage from "./RepresentativeImage";
import SmartInput from "@/components/SmartInput";
import { CharacterCreateFormValues } from "@/type/character";
import StatusWarning from "@/icons/StatusWarning";

const Profile = () => {
  const { register, watch } = useFormContext<CharacterCreateFormValues>();

  // 상태 관찰 데이터
  const titleValue = watch("title");
  const nameValue = watch("name");
  const characterIntroduceValue = watch("characterIntroduce");

  return (
    <section className="flex flex-col gap-6">
      <RepresentativeImage />

      {/* 기본 정보 입력 필드 */}
      <div id="character-basic-info" className="flex flex-col gap-6">
        {/* 제목 input */}
        <SmartInput
          label="제목"
          required={true}
          maxLength={12}
          placeholder="제목을 입력해주세요."
          isBorder
          {...register("title", { required: true })}
          value={titleValue}
          className="gap-2"
        />

        {/* 캐릭터 이름 input */}
        <SmartInput
          label="캐릭터 이름"
          required={true}
          maxLength={20}
          placeholder="캐릭터 이름을 입력해주세요."
          isBorder
          {...register("name", { required: true })}
          value={nameValue}
          className="gap-2"
        />

        {/* 캐릭터 소개 input */}
        <SmartInput
          label="캐릭터 소개"
          required={true}
          maxLength={30}
          placeholder="캐릭터 소개글을 작성해주세요."
          type="textarea"
          maxLine={3}
          minLine={3}
          isBorder
          {...register("characterIntroduce", { required: true })}
          value={characterIntroduceValue}
          className="gap-2"
        />
      </div>

      {/* 운영 정책 안내 */}
      <footer className="text-xs flex items-center gap-2 text-font-2 p-3 pr-5 rounded-xl bg-card">
        <StatusWarning className="w-5 h-5" />
        <p>
          폭력, 혐오, 성적묘사 등의 표현 및 이미지는 규정에 따라 영구적으로
          제재될 수 있어요
        </p>
      </footer>
    </section>
  );
};

export default Profile;
