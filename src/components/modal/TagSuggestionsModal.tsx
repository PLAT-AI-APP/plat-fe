import React from "react";
import { ModalLayout } from "../ModalLayout";
import { Close, Megaphone } from "@/icons";
import SmartInput from "../SmartInput";
import { useForm, useWatch } from "react-hook-form";
import ActiveButton from "../ActiveButton";

interface TagFormValues {
  name: string;
  opinion: string;
}

import { TagSuggestionsModalProps } from "@/type/modal";
import { useHashtagSuggestMutation } from "@/api/hashtag/postHashtagSuggest";

const TagSuggestionsModal = ({ onClose }: TagSuggestionsModalProps) => {
  const { register, control, handleSubmit } = useForm<TagFormValues>({
    defaultValues: {
      name: "",
      opinion: "",
    },
  });

  const nameValue = useWatch({ control, name: "name" });
  const opinionValue = useWatch({ control, name: "opinion" });

  const { mutate: hashtagSuggest } = useHashtagSuggestMutation();

  const onSubmit = (data: TagFormValues) => {
    const { name, opinion } = data;
    hashtagSuggest({ name, opinion });
    onClose();
  };
  return (
    <ModalLayout onClose={onClose} hasBackground className="p-5 w-112.5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className="flex items-center justify-between pb-6">
          <div className="flex gap-3 items-center">
            <Megaphone aria-hidden="true" />
            <h2 className="text-[20px] font-semibold">해시태그 제안하기</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="모달 닫기">
            <Close className="w-3.5 h-3.5 cursor-pointer" />
          </button>
        </header>
        <div className="flex flex-col gap-6">
          <SmartInput
            {...register("name", {
              required: {
                value: true,
                message: "해시태그를 입력해주세요.",
              },
            })}
            value={nameValue}
            label="해시태그"
            maxLength={10}
            placeholder="제안할 해시태그를 입력해주세요."
            required
          />
          <SmartInput
            {...register("opinion", {
              required: {
                value: true,
                message: "의견을 입력해주세요.",
              },
            })}
            type="textarea"
            value={opinionValue}
            label="의견"
            maxLength={200}
            maxLine={10}
            minLine={10}
            placeholder="해시태그를 제안한 이유나 의견이 있다면 자유롭게 적어주세요."
            required
          />
        </div>
        <ActiveButton
          type="submit"
          isActive={Boolean(opinionValue && nameValue)}
          text="전송"
          className="rounded-xl text-sm font-medium mt-6.5"
        />
      </form>
    </ModalLayout>
  );
};

export default TagSuggestionsModal;
