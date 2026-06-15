"use client";

import React, { MouseEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import TagAddModal from "@/components/modal/TagAddModal";
import CategorySelectPopover from "@/components/popover/CategorySelectPopover";
import PublicSelectPopover from "@/components/popover/PublicSelectPopover";
import TendencySelectPopover from "@/components/popover/TendencySelectPopover";
import useToggle from "@/hooks/useToggle";
import { Close } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";

const Setting = () => {
  const t = useTranslations("characterCreate.settings");
  const selectorT = useTranslations("selector");
  const categoryT = useTranslations("category");
  const { setValue, register, control } =
    useFormContext<CharacterCreateFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagIds",
  });
  const tagList = useWatch({ control, name: "tagIds" });
  const publicTriggerRef = useRef(null);
  const tendencyTriggerRef = useRef(null);
  const categoryTriggerRef = useRef(null);
  const [tagInputValue, setTagInputValue] = useState<{
    id: number;
    label: string;
  }>({ id: 0, label: "" });
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
  const tendencyLabelByValue: Record<string, string> = {
    전체: selectorT("all"),
    남성향: selectorT("male"),
    여성향: selectorT("female"),
  };
  const categoryLabelByValue: Record<string, string> = {
    시뮬레이션: categoryT("simulation"),
    로맨스: categoryT("romance"),
    "판타지/SF": categoryT("fantasySf"),
    드라마: categoryT("drama"),
    "무협/사극": categoryT("martialArtsHistorical"),
    GL: categoryT("gl"),
    BL: categoryT("bl"),
    "공포/추리": categoryT("horrorMystery"),
    액션: categoryT("action"),
    "코믹/일상": categoryT("comicDaily"),
    "스포츠/학원": categoryT("sportsSchool"),
    기타: categoryT("etc"),
  };

  const handleIsPublic = (isPublic: boolean) => {
    setValue("isPublic", isPublic);
    publicModal.close();
  };

  const handleTendency = (nextTendency: string) => {
    setValue("tendency", nextTendency);
    tendencyModal.close();
  };

  const handleCategory = (category: string) => {
    setValue("category", category);
    categoryModal.close();
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = tagInputValue;

    if (!trimmedValue) return;
    if (fields.length >= 5) {
      alert(t("tagMaxAlert"));
      return;
    }
    if (fields.some((tag) => tag.id === trimmedValue.id)) {
      alert(t("tagDuplicateAlert"));
      return;
    }

    append({ id: trimmedValue.id, label: trimmedValue.label });
    setTagInputValue({ id: 0, label: "" });
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
      <SmartInput
        ref={publicTriggerRef}
        type="modal"
        label={t("publicLabel")}
        required
        value={isPublicWatch ? selectorT("public") : selectorT("private")}
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

      <SmartInput
        {...register("characterDescription")}
        label={t("descriptionLabel")}
        required
        description={t("descriptionHelp")}
        type="textarea"
        minLine={10}
        maxLine={10}
        maxLength={1000}
        value={characterDescription}
        descFontSize="body-6"
      />

      <SmartInput
        ref={tendencyTriggerRef}
        type="modal"
        label={t("tendencyLabel")}
        required
        value={tendencyLabelByValue[tendency] ?? tendency}
        isOpen={tendencyModal.isOpen}
        toggleIsOpen={tendencyModal.toggle}
        description={t("tendencyHelp")}
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

      <SmartInput
        ref={categoryTriggerRef}
        type="modal"
        label={t("categoryLabel")}
        required
        value={categoryLabelByValue[categoryWatch] ?? categoryWatch}
        placeholder={categoryWatch || t("noCategory")}
        isOpen={categoryModal.isOpen}
        toggleIsOpen={categoryModal.toggle}
        descFontSize="body-6"
        description={t("categoryHelp")}
        modalComponents={
          categoryModal.isOpen && (
            <CategorySelectPopover
              categoryTriggerRef={categoryTriggerRef}
              currentCategory={categoryWatch}
              handlecategory={handleCategory}
              onClose={categoryModal.toggle}
            />
          )
        }
      />

      <form onSubmit={addTag}>
        <div onClick={toggleIsTagModal}>
          <SmartInput
            required
            type="modal"
            placeholder={t("tagPlaceholder")}
            label={t("tagLabel", { count: tagList.length })}
            inputClassName="cursor-pointer placeholder:text-font-2"
          />
        </div>

        <ul className="flex gap-1 pt-2">
          {tagList.map((tag, i) => (
            <li
              key={i}
              className="flex items-center gap-1 rounded-md bg-card px-1.25 py-0.5"
            >
              <span className="body-6 text-brand">#{tag.label}</span>
              <Close
                onClick={() => removeTag(i)}
                className="h-2 w-2 cursor-pointer text-font-2"
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
