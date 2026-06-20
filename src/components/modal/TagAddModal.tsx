"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { ModalLayout } from "../ModalLayout";
import { useHashtagListQuery } from "@/api/hashtag/getHashtagList";
import { ArrowRight, Close, Megaphone, Search } from "@/icons";
import Tag from "@/icons/Tag";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { useModalStore } from "@/store/useModalStore";
import { TagAddModalProps } from "@/type/modal";

const TagAddModal = ({ onClose }: TagAddModalProps) => {
  const t = useTranslations("characterCreate.tagModal");
  const { control, setValue } = useFormContext<CharacterCreateFormValues>();
  const currentTagsWatch = useWatch({ control, name: "tagIds" });
  const [localSelectedNames, setLocalSelectedNames] = useState<
    { id: number; label: string }[]
  >(() => {
    const currentTags = currentTagsWatch || [];
    return currentTags.map((tag) => ({ id: tag.id, label: tag.label }));
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { data: hashtagListData } = useHashtagListQuery();
  const hashtagList = hashtagListData?.tags || [];
  const normalizedSearchKeyword = searchKeyword
    .replace(/^#\s?/, "")
    .trim()
    .toLowerCase();
  const filteredTags = hashtagList
    .filter((tag) =>
      tag.label.toLowerCase().includes(normalizedSearchKeyword),
    )
    .sort((a, b) => {
      const aSelected = localSelectedNames.some((name) => name.label === a.label);
      const bSelected = localSelectedNames.some((name) => name.label === b.label);

      if (aSelected !== bSelected) {
        return aSelected ? -1 : 1;
      }
      return a.label.localeCompare(b.label, "ko");
    });

  const commitSelectedTags = (nextTags: { id: number; label: string }[]) => {
    // 태그 선택 모달은 별도 완료 버튼이 없어서 선택 상태를 즉시 form 값에 반영합니다.
    setLocalSelectedNames(nextTags);
    setValue("tagIds", nextTags, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTagToggle = (tag: { id: number; label: string }) => {
    const isAlreadySelected = localSelectedNames.some((name) => name.id === tag.id);

    if (isAlreadySelected) {
      commitSelectedTags(
        localSelectedNames.filter((name) => name.id !== tag.id),
      );
      return;
    }

    if (localSelectedNames.length >= 5) {
      alert(t("maxAlert"));
      return;
    }

    commitSelectedTags([...localSelectedNames, tag]);
  };

  const handleClearAll = () => {
    commitSelectedTags([]);
  };

  const shouldShowSearchPrefix = isSearchFocused || Boolean(searchKeyword);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // # prefix는 별도 시각 요소로만 보여주고, 한글 IME 조합이 깨지지 않게 입력값은 순수 검색어만 저장합니다.
    setSearchKeyword(e.target.value.replace(/^#\s?/, ""));
  };

  const { openModal } = useModalStore();

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-[430px] max-w-[calc(100vw-40px)] rounded-3xl border-0 bg-bg-dark p-5"
    >
      <div id="tag-manager-root" className="flex flex-col">
        <header className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-3">
            <Tag className="size-6 text-font-1" aria-hidden="true" />
            <h2 className="title-1">{t("title")}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-5.5 w-5.5 items-center justify-center rounded-lg p-1 hover:bg-btn-hover"
          >
            <Close className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="group relative flex w-full items-center pb-3">
          <input
            id="search-input"
            type="text"
            value={searchKeyword}
            className={cn(
              "body-4 h-10 w-full rounded-xl px-4 pl-10 text-font-1 outline-none transition-none placeholder:text-font-disabled",
              shouldShowSearchPrefix && "pl-14",
              searchKeyword
                ? "border border-transparent bg-card"
                : "border border-border-main bg-bg-darkest",
            )}
            placeholder={shouldShowSearchPrefix ? "" : t("searchPlaceholder")}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <label
            htmlFor="search-input"
            className="pointer-events-none absolute left-4"
          >
            <Search className="h-4.5 w-4.5 text-font-disabled" />
          </label>
          {shouldShowSearchPrefix && (
            <span className="body-4 pointer-events-none absolute left-10 text-font-1">
              #
            </span>
          )}
        </div>

        <nav>
          <ul className="custom-scrollbar flex max-h-85 min-h-85 flex-wrap content-start gap-x-2 gap-y-2 overflow-auto rounded-xl bg-bg-darkest p-3">
            {filteredTags.map((tag) => {
              const isSelected = localSelectedNames.some(
                (name) => name.id === tag.id,
              );

              return (
                <li key={tag.id}>
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "body-6 flex h-7 items-center rounded-md border border-transparent bg-card px-2.5 text-font-2 transition-none hover:bg-card-hover",
                      isSelected &&
                        "border-brand bg-brand/10 font-semibold text-brand",
                    )}
                    style={{ transition: "none", animation: "none" }}
                  >
                    #{tag.label}
                  </button>
                </li>
              );
            })}
            {filteredTags.length === 0 && (
              <p className="w-full py-10 text-center text-xs text-font-disabled">
                {t("empty")}
              </p>
            )}
          </ul>
        </nav>

        <section className="mt-3 flex flex-col gap-3">
          <div className="body-6 flex items-center justify-between text-font-2">
            <span>{t("selectedCount", { count: localSelectedNames.length })}</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="underline transition-none"
              style={{ transition: "none", animation: "none" }}
            >
              {t("clearAll")}
            </button>
          </div>

          {localSelectedNames.length > 0 && (
            <ul className="no-scrollbar flex max-w-full min-w-0 gap-2 overflow-x-auto whitespace-nowrap pb-1">
              {localSelectedNames.map((tag) => (
                <li key={tag.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className="body-6 flex h-8 items-center gap-1 rounded-md bg-brand/10 px-2.5 font-semibold text-brand transition-none"
                    style={{ transition: "none", animation: "none" }}
                  >
                    #{tag.label}
                    <Close className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-5 flex h-10">
          <button
            type="button"
            onClick={() => openModal("TAG_SUGGESTIONS", {})}
            className="flex flex-1 items-center justify-between rounded-xl bg-card p-3 text-xs text-font-2 transition-none hover:bg-card-hover"
            style={{ transition: "none", animation: "none" }}
          >
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="body-6">{t("request")}</span>
            </div>
            <ArrowRight className="h-3 w-3" />
          </button>
        </footer>
      </div>
    </ModalLayout>
  );
};

export default TagAddModal;
