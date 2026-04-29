import TagAddModal from "@/components/modal/TagAddModal";
import { ModalLayout } from "@/components/ModalLayout";
import SmartInput from "@/components/SmartInput";
import useModal from "@/hooks/useModal";
import { Close } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/type/character";
import React, { useState, useRef, MouseEvent } from "react"; // useRef 추가
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const CATEGORIES = [
  "시뮬레이션",
  "로맨스",
  "판타지/SF",
  "드라마",
  "무협/사극",
  "GL",
  "BL",
  "공포/추리",
  "액션",
  "코믹/일상",
  "스포츠/학원",
  "기타",
];

const Setting = () => {
  const { setValue, register, control } =
    useFormContext<CharacterCreateFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagList",
  });
  const tagList = useWatch({ control, name: "tagList" });

  // 트리거 Ref 생성 시작
  const publicTriggerRef = useRef(null);
  const tendencyTriggerRef = useRef(null);
  const categoryTriggerRef = useRef(null);

  const [tagInputValue, setTagInputValue] = useState("");

  // modal 제어
  // const [isPublic, setIsPublic] = useState(false);
  // const [isTendency, setIsTendency] = useState(false);
  // const [iscategory, setIscategory] = useState(false);

  const publicModal = useModal();
  const tendencyModal = useModal();
  const categoryModal = useModal();

  // const toggleIsPublic = () => {
  //   setIsPublic((prev) => !prev);
  // };
  // const toggleisTendency = () => {
  //   setIsTendency((prev) => !prev);
  // };
  // const toggleiscategory = () => {
  //   setIscategory((prev) => !prev);
  // };

  const isPublicWatch = useWatch({ control, name: "isPublic" });
  const characterDescription = useWatch({
    control,
    name: "characterDescription",
  });
  const tendencyWatch = useWatch({ control, name: "tendency" });
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
    const trimmedValue = tagInputValue.trim();

    if (!trimmedValue) return;
    if (fields.length >= 5) {
      alert("태그는 최대 5개까지 등록 가능합니다.");
      return;
    }
    if (fields.some((tag) => tag.name === trimmedValue)) {
      alert("이미 등록된 태그입니다.");
      return;
    }

    append({ name: trimmedValue });
    setTagInputValue("");
  };
  const removeTag = (index: number) => {
    remove(index);
  };

  const TENDENCY_LIST = ["전체", "남성향", "여성향"] as const;

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
            <ModalLayout
              onClose={publicModal.toggle}
              triggerRef={publicTriggerRef} // ModalLayout에 전달
              className="w-full"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-1"
              >
                <div
                  onClick={() => handleIsPublic(true)}
                  className={cn(
                    "hover:bg-btn-hover flex justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                  )}
                >
                  <span>공개</span>
                  {isPublicWatch && (
                    <Check className="w-4.5 h-4.5 text-brand" />
                  )}
                </div>

                <div
                  onClick={() => handleIsPublic(false)}
                  className={cn(
                    "hover:bg-btn-hover flex justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                  )}
                >
                  <span>비공개</span>
                  {!isPublicWatch && (
                    <Check className="w-4.5 h-4.5 text-brand" />
                  )}
                </div>
              </div>
            </ModalLayout>
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
      />

      {/* 성향 선택 */}
      <SmartInput
        ref={tendencyTriggerRef} // 트리거 Ref 적용
        type="modal"
        label="성향"
        required
        value={tendencyWatch}
        isOpen={tendencyModal.isOpen}
        toggleIsOpen={tendencyModal.toggle}
        modalComponents={
          tendencyModal.isOpen && (
            <ModalLayout
              onClose={tendencyModal.toggle}
              triggerRef={tendencyTriggerRef} // ModalLayout에 전달
              className="w-full"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-1"
              >
                {TENDENCY_LIST.map((tendency) => (
                  <div
                    key={tendency}
                    onClick={() => handleTendency(tendency)}
                    className={cn(
                      "hover:bg-btn-hover flex justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                    )}
                  >
                    <span>{tendency}</span>
                    {tendencyWatch === tendency && (
                      <Check className="w-4.5 h-4.5 text-brand" />
                    )}
                  </div>
                ))}
              </div>
            </ModalLayout>
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
        modalComponents={
          categoryModal.isOpen && (
            <ModalLayout
              onClose={categoryModal.close}
              triggerRef={categoryTriggerRef} // ModalLayout에 전달
              className="w-full right-0 bottom-full top-auto -translate-y-2.5"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-1 "
              >
                {CATEGORIES.map((category) => (
                  <div
                    key={category}
                    onClick={() => handlecategory(category)}
                    className={cn(
                      "hover:bg-btn-hover flex justify-between px-2.5 py-2 rounded-lg cursor-pointer",
                    )}
                  >
                    <span>{category}</span>
                    {categoryWatch === category && (
                      <Check className="w-4.5 h-4.5 text-brand" />
                    )}
                  </div>
                ))}
              </div>
            </ModalLayout>
          )
        }
      />

      {/* 태그 추가 */}
      <form onSubmit={addTag}>
        <div onClick={toggleIsTagModal}>
          <SmartInput
            onChange={(e) => setTagInputValue(e.target.value)}
            required
            type="modal"
            placeholder="태그를 등록해주세요."
            label={`태그 등록(${tagList.length}/5)`}
            value={tagInputValue}
            inputClassName="placeholder:text-font-2 cursor-pointer"
          />
        </div>

        <ul className="flex gap-1 pt-2">
          {tagList.map((tag, i) => (
            <li
              key={i}
              className="px-1.25 py-0.5 flex items-center gap-1 rounded-md bg-card"
            >
              <span className="text-xs text-brand">#{tag.name}</span>
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
