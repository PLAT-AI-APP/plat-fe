import TagAddModal from "@/components/modal/TagAddModal";
import CategorySelectPopover from "@/components/popover/CategorySelectPopover";
import PublicSelectPopover from "@/components/popover/PublicSelectPopover";
import TendencySelectPopover from "@/components/popover/TendencySelectPopover";
import SmartInput from "@/components/smart-input";
import useToggle from "@/hooks/useToggle";
import { Close } from "@/icons";
import { CharacterCreateFormValues } from "@/type/character";
import React, { useState, useRef, MouseEvent } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const Setting = () => {
  const { setValue, register, control } =
    useFormContext<CharacterCreateFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagIds",
  });
  const tagList = useWatch({ control, name: "tagIds" });

  // 트리거 Ref 생성 시작
  const publicTriggerRef = useRef(null);
  const tendencyTriggerRef = useRef(null);
  const categoryTriggerRef = useRef(null);

  const [tagInputValue, setTagInputValue] = useState<{
    id: number;
    label: string;
  }>({
    id: 0,
    label: "",
  });

  const publicModal = useToggle();
  const tendencyModal = useToggle();
  const categoryModal = useToggle();

  const isPublicWatch = useWatch({ control, name: "isPublic" });
  const characterDescription = useWatch({
    control,
    name: "characterDescription",
  });
  const tendency = useWatch({ control, name: "tendency" });
  const categoryWatch = useWatch({ control, name: "category" });

  // 공개여부 change
  const handleIsPublic = (ispublic: boolean) => {
    setValue("isPublic", ispublic);
    publicModal.close();
  };
  // 성향 change
  const handleTendency = (tendency: string) => {
    setValue("tendency", tendency);
    tendencyModal.close();
  };
  // 카테고리 change
  const handlecategory = (category: string) => {
    setValue("category", category);
    categoryModal.close();
  };
  // tab 추가
  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = tagInputValue;

    if (!trimmedValue) return;
    if (fields.length >= 5) {
      alert("태그는 최대 5개까지 등록 가능합니다.");
      return;
    }
    if (fields.some((tag) => tag.id === trimmedValue.id)) {
      alert("이미 등록된 태그입니다.");
      return;
    }

    append({
      id: trimmedValue.id,
      label: trimmedValue.label,
    });

    setTagInputValue({
      id: 0,
      label: "",
    });
  };
  const removeTag = (index: number) => {
    remove(index);
  };

  const [isTagModal, setIsTagModal] = useState(false);
  const toggleIsTagModal = (e?: MouseEvent) => {
    e?.stopPropagation();
    setIsTagModal((prev) => !prev);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* 공개여부 선택 */}
      <SmartInput
        ref={publicTriggerRef} // 트리거 Ref 적용
        type="modal"
        label="공개 여부"
        required
        value={isPublicWatch ? "공개" : "비공개"}
        isOpen={publicModal.isOpen}
        toggleIsOpen={publicModal.toggle}
        modalComponents={
          publicModal.isOpen && (
            <PublicSelectPopover
              handleIsPublic={handleIsPublic}
              isPublic={isPublicWatch}
              onClose={publicModal.toggle}
              publicTriggerRef={publicTriggerRef}
            />
          )
        }
      />

      {/* 캐릭터 설명 */}
      <SmartInput
        {...register("characterDescription", { required: true })}
        label="캐릭터 설명"
        required
        description="캐릭터의 성격이나 서사, 사건 등 상세한 내용을 작성해주세요."
        type="textarea"
        minLine={10}
        maxLine={10}
        maxLength={1000}
        value={characterDescription}
        descFontSize="body-6"
      />

      {/* 성향 선택 */}
      <SmartInput
        ref={tendencyTriggerRef} // 트리거 Ref 적용
        type="modal"
        label="성향"
        required
        value={tendency}
        isOpen={tendencyModal.isOpen}
        toggleIsOpen={tendencyModal.toggle}
        description="선택된 성향에 따라 사용자에게 추천돼요."
        descFontSize="body-6"
        modalComponents={
          tendencyModal.isOpen && (
            <TendencySelectPopover
              currentTendency={tendency}
              handleTendency={handleTendency}
              onClose={tendencyModal.toggle}
              tendencyTriggerRef={tendencyTriggerRef}
            />
          )
        }
      />

      {/* 카테고리 선택 */}
      <SmartInput
        ref={categoryTriggerRef} // 트리거 Ref 적용
        type="modal"
        label="카테고리"
        required
        value={categoryWatch}
        placeholder={categoryWatch || "[선택 없음]"}
        isOpen={categoryModal.isOpen}
        toggleIsOpen={categoryModal.toggle}
        descFontSize="body-6"
        description="캐릭터와 잘 어울리는 카테고리를 골라주세요."
        modalComponents={
          categoryModal.isOpen && (
            <CategorySelectPopover
              categoryTriggerRef={categoryTriggerRef}
              currentCategory={categoryWatch}
              handlecategory={handlecategory}
              onClose={categoryModal.toggle}
            />
          )
        }
      />

      {/* 태그 추가 */}
      <form onSubmit={addTag}>
        <div onClick={toggleIsTagModal}>
          <SmartInput
            // onChange={(e) => setTagInputValue(e.target.value)}
            required
            type="modal"
            placeholder="태그를 등록해주세요."
            label={`태그 등록(${tagList.length}/5)`}
            // value={tagInputValue}
            inputClassName="placeholder:text-font-2 cursor-pointer"
          />
        </div>

        <ul className="flex gap-1 pt-2">
          {tagList.map((tag, i) => (
            <li
              key={i}
              className="px-1.25 py-0.5 flex items-center gap-1 rounded-md bg-card"
            >
              <span className="body-6 text-brand">#{tag.label}</span>
              <Close
                onClick={() => removeTag(i)}
                className="w-2 h-2 text-font-2 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      </form>

      {isTagModal && <TagAddModal onClose={toggleIsTagModal} />}
    </section>
  );
};

export default Setting;
