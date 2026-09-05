"use client";

import { useHashtagListQuery } from "@/api/hashtag/getHashtagList";
import { ErrorState } from "@/components/state";
import {
  HASHTAG_CATEGORY_FOLDER_TITLE_KEYS,
  HASHTAG_CATEGORY_ORDER,
} from "@/constants/hashtag";
import { Close, Search } from "@/icons";
import { showAppToast } from "@/lib/toast";
import { SPRING_SOFT, TRANSITION } from "@/constants/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { TagFolder, TagOption, TagPill } from "./TagFolder";

const MAX_SELECTED_TAGS = 5;

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

  // 선택 태그 영역은 id 만 들고 있어 라벨을 되찾아야 합니다.
  const labelById = useMemo(() => {
    const labels = new Map<string, string>();
    (hashtagList?.tags ?? []).forEach((tag) => labels.set(tag.id, tag.label));

    return labels;
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

      {/* 태그 폴더 영역: 카테고리별 폴더가 같은 접힘 UI를 공유합니다. */}
      <div
        id="tag-sidebar-content"
        className="flex w-full flex-col gap-6 px-5 py-4"
      >
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
              className="fixed right-0 top-0 z-30 h-full w-[min(300px,85vw)] shrink-0 overflow-y-auto bg-dark shadow-2xl no-scrollbar"
            >
              {sidebarBody}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // 인라인 배치는 데스크톱 전용이다. JS(useMediaQuery)가 오버레이로 바꿔 주지만,
  // 그 판단이 늦거나 어긋나도 폭 300px 를 뺏기지 않도록 CSS 로도 같은 규칙을 걸어 둔다.
  return (
    <aside className="sticky top-0 hidden h-[calc(100dvh-var(--header-height))] w-[300px] shrink-0 overflow-y-auto bg-dark no-scrollbar lg:block">
      {sidebarBody}
    </aside>
  );
};

export default TagSidebar;
