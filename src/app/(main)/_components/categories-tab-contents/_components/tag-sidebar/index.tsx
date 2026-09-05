"use client";

import { useHashtagListQuery } from "@/api/hashtag/getHashtagList";
import { ErrorState } from "@/components/state";
import {
  HASHTAG_CATEGORY_FOLDER_TITLE_KEYS,
  HASHTAG_CATEGORY_ORDER,
} from "@/constants/hashtag";
import { Close, Search } from "@/icons";
import { showAppToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { SPRING_SOFT, TRANSITION } from "@/constants/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { TagFolder, TagOption, TagPill } from "./TagFolder";

const MAX_SELECTED_TAGS = 5;

// 상단의 "취향 맞춤 태그" 카드 데이터입니다.
// 카드 클릭 시 tags 배열에 들어있는 태그들이 한 번에 선택됩니다.
const RECOMMENDED_TAGS = [
  {
    title: "recommendation1Title",
    tags: ["친구", "다크판타지"],
  },
  {
    title: "recommendation2Title",
    tags: ["소꿉친구", "햇살느낌"],
  },
];


interface TagSidebarProps {
  /** 고른 태그의 id. 서버가 받는 값이라 라벨이 아니라 id 를 들고 다닙니다. */
  selectedTagIds: string[];
  onSelectedTagIdsChange: Dispatch<SetStateAction<string[]>>;
  /**
   * 태블릿 폭에서는 300px 고정폭이 카드 그리드 영역을 압박해 열 개수가 급격히
   * 줄어드므로, 인라인 배치 대신 토글로 열고 닫는 오버레이 패널로 전환합니다.
   */
  isOverlay?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

// 피그마의 AI sparkle 아이콘을 사이드바 내부에서만 쓰는 작은 로컬 아이콘입니다.
const AiLineIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className={cn("text-brand", className)}
    aria-hidden
  >
    <path
      d="M7.6 4.54c.5-1.46 2.52-1.5 3.1-.13l.04.13.68 1.97a4.4 4.4 0 0 0 2.07 2.07l1.97.68c1.46.5 1.5 2.52.13 3.1l-.13.05-1.97.67a4.4 4.4 0 0 0-2.07 2.08l-.68 1.97c-.5 1.46-2.51 1.5-3.1.13l-.05-.13-.67-1.97a4.4 4.4 0 0 0-2.08-2.07l-1.97-.68c-1.46-.5-1.5-2.51-.13-3.1l.13-.05 1.97-.67a4.4 4.4 0 0 0 2.08-2.08l.67-1.97Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M15.83 1.67 16.5 3.5l1.83.67-1.83.66-.67 1.84-.66-1.84-1.84-.66 1.84-.67.66-1.83Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const TagSidebar = ({
  selectedTagIds,
  onSelectedTagIdsChange,
  isOverlay = false,
  isOpen = true,
  onClose,
}: TagSidebarProps) => {
  const t = useTranslations("tagSidebar");
  const {
    data: hashtagList,
    error,
    isError,
    isLoading,
    refetch,
  } = useHashtagListQuery();
  // 검색어는 사이드바 내부 UI 상태로 관리합니다.
  // 선택 태그는 CategoriesTabContents에서 내려받아 결과 영역과 같은 기준으로 공유합니다.
  const [query, setQuery] = useState("");
  const tagFolders = useMemo(() => {
    const apiTags = hashtagList?.tags ?? [];

    if (apiTags.length === 0) return [];

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
  }, [hashtagList]);

  // 선택 태그 영역은 id 만 들고 있어 라벨을 되찾아야 하고, 추천 카드는 반대로 라벨로 id 를 찾습니다.
  const { labelById, idByLabel } = useMemo(() => {
    const labels = new Map<string, string>();
    const ids = new Map<string, string>();
    (hashtagList?.tags ?? []).forEach((tag) => {
      labels.set(tag.id, tag.label);
      ids.set(tag.label, tag.id);
    });

    return { labelById: labels, idByLabel: ids };
  }, [hashtagList]);

  // 검색어가 있으면 각 폴더의 태그를 필터링하고, 결과가 없는 폴더는 숨깁니다.
  // 데이터 원본(TAG_FOLDERS)은 건드리지 않도록 map/filter 결과만 렌더링합니다.
  const filteredFolders = useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return tagFolders;

    return tagFolders
      .map((folder) => ({
        ...folder,
        tags: folder.tags.filter((tag) => tag.label.includes(trimmedQuery)),
      }))
      .filter((folder) => folder.tags.length > 0);
  }, [query, tagFolders]);

  // 태그를 누를 때 선택/해제를 토글합니다.
  // 선택된 태그는 하단 "선택 태그" 영역에도 같은 상태로 표시됩니다.
  // 최대 개수(MAX_SELECTED_TAGS)에 도달한 상태에서 새 태그를 추가하려 하면 토스트로 안내합니다.
  const toggleTag = (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId);
    if (!isSelected && selectedTagIds.length >= MAX_SELECTED_TAGS) {
      showAppToast("warning", t("maxAlert"));
      return;
    }

    onSelectedTagIdsChange((prev) =>
      prev.includes(tagId)
        ? prev.filter((selectedTagId) => selectedTagId !== tagId)
        : [...prev, tagId],
    );
  };

  // 추천 카드는 여러 태그를 한 번에 추가합니다. 카드의 태그는 글자로 적혀 있어 id 로 옮겨 담고,
  // 서버에 없는 태그는 고를 수 없으므로 그대로 버립니다.
  // 최대 개수를 넘기면 태그 모달과 동일하게 전체 추가를 막고 안내합니다.
  const selectRecommendation = (labels: string[]) => {
    const newTagIds = labels
      .map((label) => idByLabel.get(label))
      .filter((tagId): tagId is string => !!tagId)
      .filter((tagId) => !selectedTagIds.includes(tagId));
    if (newTagIds.length === 0) return;

    if (selectedTagIds.length + newTagIds.length > MAX_SELECTED_TAGS) {
      showAppToast("warning", t("maxAlert"));
      return;
    }

    onSelectedTagIdsChange((prev) => Array.from(new Set([...prev, ...newTagIds])));
  };

  const sidebarBody = (
    <>
      {isOverlay && (
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="title-5 text-font-1">{t("title")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex size-8 items-center justify-center rounded-lg text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1"
          >
            <Close className="size-5" />
          </button>
        </div>
      )}

      {/* 검색 영역: 입력값은 폴더 태그 목록을 클라이언트에서 즉시 필터링합니다. */}
      <div className="px-5 py-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-font-2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="focus-ring-none h-[43px] w-full rounded-xl border border-main bg-darkest pl-[38px] pr-3 body-6 text-font-1 outline-none transition-colors placeholder:text-font-2 focus:field-focus!"
          />
        </label>
      </div>

      {/* 선택 태그 영역: 현재 선택된 태그를 모아 보여주고 개별/전체 해제가 가능합니다. */}
      <section className="border-y border-main px-5 pb-8 pt-6">
        <header className="mb-3 flex h-[21px] items-center justify-between">
          <h2 className="title-6 text-font-2">{t("selectedTags")}</h2>
          <button
            type="button"
            onClick={() => onSelectedTagIdsChange([])}
            className="body-7 text-font-2 underline-offset-2 hover:underline"
          >
            {t("clearAll")}
          </button>
        </header>

        <div className="flex flex-wrap content-start gap-2">
          {selectedTagIds.map((tagId) => (
            <TagPill
              key={tagId}
              label={labelById.get(tagId) ?? ""}
              size="lg"
              isSelected
              onRemove={() => toggleTag(tagId)}
            />
          ))}
        </div>
      </section>

      {/* 태그 폴더 영역: 취향 맞춤 카드와 일반 태그 폴더가 같은 접힘 UI를 공유합니다. */}
      <div
        id="tag-sidebar-content"
        className="flex w-full flex-col gap-6 px-5 py-4"
      >
        <TagFolder
          title={t("personalizedTags")}
          // titleSuffix={<AiLineIcon className="size-3" />}
        >
          <div className="flex flex-col gap-2">
            {RECOMMENDED_TAGS.map((item) => {
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => selectRecommendation(item.tags)}
                  className="group flex w-full items-center justify-between rounded-xl bg-darkest p-3 text-left transition-colors hover:bg-brand/10"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <AiLineIcon className="size-5 shrink-0 transition-colors group-hover:text-brand-dark" />
                      <strong className="title-6 truncate text-font-1">
                        {t(item.title)}
                      </strong>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {item.tags.map((tag) => (
                        <TagPill key={tag} label={tag} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* <Check
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      isSelected ? "text-brand" : "text-main",
                    )}
                  /> */}
                </button>
              );
            })}
          </div>
        </TagFolder>

        {isError ? (
          // 해시태그를 못 불러온 것을 "태그가 없다"로 보여주면 사용자가 필터가 사라진 줄 안다.
          <ErrorState error={error} onRetry={refetch} className="my-4" />
        ) : !isLoading && tagFolders.length === 0 ? (
          <p className="body-6 py-10 text-center text-font-disabled">
            {t("emptyHashtags")}
          </p>
        ) : (
          filteredFolders.map((folder) => (
            <TagFolder
              key={folder.title}
              title={t.has(folder.title) ? t(folder.title) : folder.title}
              tags={folder.tags}
              selectedTagIds={selectedTagIds}
              onTagToggle={toggleTag}
            />
          ))
        )}
      </div>
    </>
  );

  // 태블릿 폭: 토글 버튼으로 열고 닫는 오버레이 패널. 닫힌 상태에서는 아예
  // 렌더링하지 않아 카드 그리드가 300px를 다시 온전히 돌려받습니다.
  if (isOverlay) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={TRANSITION}
              onClick={onClose}
              className="fixed inset-0 z-20 bg-scrim/50"
              aria-hidden
            />
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={SPRING_SOFT}
              className="fixed right-0 top-0 z-30 h-full w-[300px] shrink-0 overflow-y-auto bg-dark shadow-2xl no-scrollbar"
            >
              {sidebarBody}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className="sticky top-0 h-[calc(100vh-var(--header-height))] w-[300px] shrink-0 overflow-y-auto bg-dark no-scrollbar">
      {sidebarBody}
    </aside>
  );
};

export default TagSidebar;
