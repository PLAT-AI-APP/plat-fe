"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { ModalLayout } from "../ModalLayout";
import { useHashtagListQuery } from "@/api/hashtag/getHashtagList";
import { TAG_FOLDERS } from "@/app/(main)/_components/categories-tab-contents/_components/tag-sidebar";
import {
  HASHTAG_CATEGORY_FOLDER_TITLE_KEYS,
  HASHTAG_CATEGORY_ORDER,
} from "@/constants/hashtag";
import { ArrowDown, ArrowRight, Close, Megaphone, Search } from "@/icons";
import Tag from "@/icons/Tag";
import { cn } from "@/lib/utils";
import { showAppToast } from "@/lib/toast";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { useModalStore } from "@/store/useModalStore";
import { TagAddModalProps } from "@/type/modal";

type TagOption = { id: string; label: string };

interface TagFolderSection {
  title: string;
  tags: TagOption[];
}

const TAG_ID_OFFSET = 1;

const TagAddModal = ({ onClose }: TagAddModalProps) => {
  const t = useTranslations("characterCreate.tagModal");
  const tagSidebarT = useTranslations("tagSidebar");
  const { data: hashtagList } = useHashtagListQuery();
  const { control, setValue } = useFormContext<CharacterCreateFormValues>();
  const currentTagsWatch = useWatch({ control, name: "tagIds" });
  const [localSelectedNames, setLocalSelectedNames] = useState<TagOption[]>(
    () => {
      const currentTags = currentTagsWatch || [];
      return currentTags.map((tag) => ({ id: tag.id, label: tag.label }));
    },
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [closedFolderTitles, setClosedFolderTitles] = useState<string[]>([]);
  const normalizedSearchKeyword = searchKeyword
    .replace(/^#\s?/, "")
    .trim()
    .toLowerCase();
  const isSearchMode = Boolean(normalizedSearchKeyword);

  const tagFolderSections = useMemo<TagFolderSection[]>(() => {
    const apiTags = hashtagList?.tags ?? [];

    if (apiTags.length > 0) {
      const tagsByCategory = new Map<string, TagOption[]>();
      apiTags.forEach((tag) => {
        const tags = tagsByCategory.get(tag.category) ?? [];
        tags.push({ id: tag.id, label: tag.label });
        tagsByCategory.set(tag.category, tags);
      });

      return HASHTAG_CATEGORY_ORDER.filter((category) =>
        tagsByCategory.has(category),
      ).map((category) => ({
        title: HASHTAG_CATEGORY_FOLDER_TITLE_KEYS[category],
        tags: tagsByCategory.get(category) ?? [],
      }));
    }

    const tagIdByLabel = new Map(
      Array.from(new Set(TAG_FOLDERS.flatMap((folder) => folder.tags))).map(
        (label, index) => [label, String(index + TAG_ID_OFFSET)] as const,
      ),
    );

    // 실제 API 연결 전까지는 TAG_FOLDERS 목 데이터를 태그 선택 모달의 단일 원본으로 사용합니다.
    return TAG_FOLDERS.map((folder) => ({
      title: folder.title,
      tags: folder.tags.map((label) => ({
        id: tagIdByLabel.get(label) ?? String(TAG_ID_OFFSET),
        label,
      })),
    }));
  }, [hashtagList]);

  const hasTags = tagFolderSections.some((folder) => folder.tags.length > 0);
  const matchedTags = useMemo(() => {
    if (!isSearchMode) return [];

    // 검색어와 일치하는 태그는 기존 목록에서 빼지 않고, 상단의 별도 영역에만 모아 보여줍니다.
    return tagFolderSections
      .flatMap((folder) => folder.tags)
      .filter((tag) =>
        tag.label.toLowerCase().includes(normalizedSearchKeyword),
      );
  }, [isSearchMode, normalizedSearchKeyword, tagFolderSections]);

  const commitSelectedTags = (nextTags: TagOption[]) => {
    // 태그 선택 모달은 별도 완료 버튼이 없어서 선택 상태를 즉시 form 값에 반영합니다.
    setLocalSelectedNames(nextTags);
    setValue("tagIds", nextTags, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTagToggle = (tag: TagOption) => {
    const isAlreadySelected = localSelectedNames.some(
      (name) => name.id === tag.id,
    );

    if (isAlreadySelected) {
      commitSelectedTags(
        localSelectedNames.filter((name) => name.id !== tag.id),
      );
      return;
    }

    if (localSelectedNames.length >= 5) {
      showAppToast("warning", t("maxAlert"));
      return;
    }

    commitSelectedTags([...localSelectedNames, tag]);
  };

  const handleClearAll = () => {
    commitSelectedTags([]);
  };

  const shouldShowSearchPrefix = isSearchFocused || Boolean(searchKeyword);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // # prefix는 시각 요소로만 보여주고, 한글 IME 조합이 깨지지 않게 실제 검색어만 저장합니다.
    setSearchKeyword(e.target.value.replace(/^#\s?/, ""));
  };

  const toggleFolderOpen = (title: string) => {
    setClosedFolderTitles((prev) =>
      prev.includes(title)
        ? prev.filter((folderTitle) => folderTitle !== title)
        : [...prev, title],
    );
  };

  const { openModal } = useModalStore();

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-[430px] max-w-[calc(100vw-40px)] rounded-3xl border-0 bg-dark p-5"
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
              "focus-ring-none body-4 h-10 w-full rounded-xl px-4 pl-10 text-font-1 outline-none transition-colors placeholder:text-font-disabled focus:field-focus!",
              shouldShowSearchPrefix && "pl-14",
              searchKeyword
                ? "border border-transparent bg-card"
                : "border border-main bg-darkest",
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

        <nav className="custom-scrollbar flex max-h-85 min-h-85 flex-col gap-5 overflow-auto rounded-xl bg-darkest p-4">
          {matchedTags.length > 0 && (
            <section>
              <h3 className="body-4 text-font-2">{t("matchedSearch")}</h3>
              <ul className="mt-3 flex flex-wrap content-start gap-x-2 gap-y-2">
                {matchedTags.map((tag) => {
                  const isSelected = localSelectedNames.some(
                    (name) => name.id === tag.id,
                  );

                  return (
                    <li key={`matched-${tag.label}`}>
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          "body-6 flex h-7 items-center rounded-md border border-font-2 bg-dark px-2.5 text-font-1 hover:bg-card-hover",
                          isSelected && "border-brand bg-brand/10 text-brand",
                        )}
                      >
                        #{tag.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {tagFolderSections.map((folder) => {
            const isOpen = !closedFolderTitles.includes(folder.title);
            const selectedCount = folder.tags.filter((tag) =>
              localSelectedNames.some((selected) => selected.id === tag.id),
            ).length;

            return (
              <section key={folder.title}>
                <button
                  type="button"
                  onClick={() => toggleFolderOpen(folder.title)}
                  className="flex h-6 w-full items-center justify-between text-left hover:text-font-1"
                >
                  <span className="body-4 flex min-w-0 items-center gap-1.5 text-font-2">
                    <span className="truncate">
                      {tagSidebarT.has(folder.title)
                        ? tagSidebarT(folder.title)
                        : folder.title}
                    </span>
                    {!isOpen && selectedCount > 0 && (
                      <span className="shrink-0 text-brand-dark">
                        +{selectedCount}
                      </span>
                    )}
                  </span>
                  <ArrowDown
                    className={cn(
                      "size-4 shrink-0 text-font-2",
                      !isOpen && "-rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <ul className="mt-3 flex flex-wrap content-start gap-x-2 gap-y-2">
                    {folder.tags.map((tag) => {
                      const isSelected = localSelectedNames.some(
                        (name) => name.id === tag.id,
                      );

                      return (
                        <li key={`${folder.title}-${tag.label}`}>
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={cn(
                              "body-6 flex h-7 items-center rounded-md border border-transparent bg-card px-2.5 text-font-2 hover:bg-card-hover",
                              isSelected &&
                                "border-brand bg-brand/10 text-brand",
                            )}
                          >
                            #{tag.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}

          {!hasTags && (
            <p className="body-6 w-full py-10 text-center text-font-disabled">
              {t("empty")}
            </p>
          )}
        </nav>

        <section className="mt-3 flex flex-col gap-3">
          <div className="body-6 flex items-center justify-between text-font-2">
            <span>
              {t("selectedCount", { count: localSelectedNames.length })}
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="underline hover:text-font-1"
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
                    className="caption-1 flex h-8 items-center gap-1 rounded-md bg-brand/10 px-2.5 text-brand hover:bg-brand/20"
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
            className="flex flex-1 items-center justify-between rounded-xl bg-card p-3 body-6 text-font-2 hover:bg-card-hover"
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
