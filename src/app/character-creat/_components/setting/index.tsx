"use client";

import React, { MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import TagAddModal from "@/components/modal/TagAddModal";
import { ArrowRight } from "@/icons";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";

const TENDENCY_LIST = ["전체", "남성향", "여성향"] as const;

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
] as const;

const Setting = () => {
  const t = useTranslations("characterCreate.settings");
  const selectorT = useTranslations("selector");
  const categoryT = useTranslations("category");
  const { setValue, control } = useFormContext<CharacterCreateFormValues>();
  const tagList = useWatch({ control, name: "tagIds" });
  const isTagFull = tagList.length >= 5;
  const isPublicWatch = useWatch({ control, name: "isPublic" });
  const allowComments = useWatch({ control, name: "allowComments" });
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
    setValue("isPublic", isPublic, { shouldDirty: true, shouldValidate: true });
  };

  const handleAllowComments = (nextAllowComments: boolean) => {
    setValue("allowComments", nextAllowComments, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTendency = (nextTendency: string) => {
    setValue("tendency", nextTendency, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCategory = (category: string) => {
    // 카테고리는 복수 선택이므로 기존 배열에서 선택값을 토글해 관리합니다.
    const currentCategories = categoryWatch ?? [];
    const nextCategory = currentCategories.includes(category)
      ? currentCategories.filter((selectedCategory) => selectedCategory !== category)
      : [...currentCategories, category];

    setValue("category", nextCategory, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const [isTagModal, setIsTagModal] = useState(false);
  const toggleIsTagModal = (e?: MouseEvent) => {
    e?.stopPropagation();
    setIsTagModal((prev) => !prev);
  };

  return (
    <section className="flex flex-col gap-9">
      <section className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="title-3 text-font-1">{t("publicLabel")}</h3>
          <p className="body-5 text-font-2">{t("publicHelp")}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isPublicWatch}
          onClick={() => handleIsPublic(!isPublicWatch)}
          className={cn(
            "relative flex h-6 w-11 items-center rounded-[100px] bg-card p-0.5 transition-colors duration-300 ease-out",
            isPublicWatch && "bg-brand",
          )}
        >
          <span
            className={cn(
              "size-5 rounded-full bg-font-1 transition-transform duration-300 ease-out",
              isPublicWatch ? "translate-x-5" : "translate-x-0",
            )}
            aria-hidden="true"
          />
        </button>
      </section>

      <section className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="title-3 text-font-1">{t("commentAllowLabel")}</h3>
          <p className="body-6 text-font-2">{t("commentAllowHelp")}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={allowComments}
          onClick={() => handleAllowComments(!allowComments)}
          className={cn(
            "relative h-6 w-[45px] rounded-[70.588px] bg-card transition-colors duration-300 ease-out",
            allowComments && "bg-brand",
          )}
        >
          <span
            className={cn(
              "absolute left-[3px] top-1/2 size-[18px] -translate-y-1/2 rounded-full bg-font-1 transition-transform duration-300 ease-out",
              allowComments && "translate-x-[21px]",
            )}
            aria-hidden="true"
          />
        </button>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="title-3 text-font-1">{t("tendencyLabel")}</h3>
          <p className="body-5 text-font-2">{t("tendencyHelp")}</p>
        </div>

        {/* 성향은 팝오버가 아니라 피그마처럼 즉시 선택 가능한 segmented control로 보여줍니다. */}
        <div className="grid grid-cols-3 gap-2">
          {TENDENCY_LIST.map((item) => {
            const isActive = tendency === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleTendency(item)}
                className={cn(
                  "body-4 flex h-10 items-center justify-center rounded-xl transition-none",
                  isActive
                    ? "bg-brand/10 text-brand-dark"
                    : "bg-darkest text-font-2",
                )}
                style={{ transition: "none", animation: "none" }}
              >
                {tendencyLabelByValue[item]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="title-3 text-font-1">
            {t("categoryLabel")} <span className="text-font-accents">*</span>
          </h3>
          <p className="body-5 text-font-2">{t("categoryHelp")}</p>
        </div>

        {/* 카테고리는 전체 후보를 노출해 선택 비용을 줄입니다. */}
        <div className="flex flex-wrap gap-x-1.5 gap-y-2">
          {CATEGORIES.map((category) => {
            const selectedCategories = categoryWatch ?? [];
            const isActive = selectedCategories.includes(category);
            const isInactive = selectedCategories.length > 0 && !isActive;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategory(category)}
                className={cn(
                  "bg-dark body-4 flex h-8 items-center rounded-[100px] px-3 border border-main transition-none",
                  isActive && "bg-brand/10 text-brand-dark",
                  selectedCategories.length === 0 && "text-font-1",
                  isInactive && "text-font-disabled",
                )}
                style={{ transition: "none", animation: "none" }}
              >
                {categoryLabelByValue[category]}
              </button>
            );
          })}
        </div>
      </section>

      <form>
        <section className="flex flex-col gap-2">
          <h3 className="title-3 text-font-1">
            {t("tagLabel", { count: tagList.length })}{" "}
            <span className="text-font-accents">*</span>
          </h3>

          <button
            type="button"
            onClick={toggleIsTagModal}
            className="body-4 flex h-11 items-center justify-between rounded-xl border border-main bg-darkest px-4 text-font-2 transition-none"
            style={{ transition: "none", animation: "none" }}
          >
            <span>
              {isTagFull ? t("tagFullPlaceholder") : t("tagPlaceholder")}
            </span>
            <ArrowRight className="size-3 text-font-2" />
          </button>
        </section>

        <div className="body-6 mt-2 flex items-center justify-between gap-3 text-font-2">
          <span className="shrink-0">
            {t("selectedTagCount", { count: tagList.length })}
          </span>

          {tagList.length > 0 && (
            <ul className="no-scrollbar flex min-w-0 justify-end gap-2 overflow-x-auto whitespace-nowrap">
              {tagList.map((tag) => (
                <li key={tag.id} className="shrink-0 text-brand">
                  #{tag.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {isTagModal && <TagAddModal onClose={toggleIsTagModal} />}
    </section>
  );
};

export default Setting;
