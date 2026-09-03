"use client";

import { useHashtagListQuery } from "@/api/hashtag/getHashtagList";
import { ErrorState } from "@/components/state";
import {
  HASHTAG_CATEGORY_FOLDER_TITLE_KEYS,
  HASHTAG_CATEGORY_ORDER,
} from "@/constants/hashtag";
import { Search } from "@/icons";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { TagFolder, TagPill } from "./TagFolder";

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

// 사이드바에 표시할 태그 폴더 데이터입니다.
// 새 카테고리가 필요하면 이 배열에 title과 tags만 추가하면 UI가 자동으로 렌더링됩니다.
export const TAG_FOLDERS = [
  {
    title: "folderGenre",
    tags: [
      "판타지",
      "로맨스",
      "로판",
      "현대판타지",
      "다크판타지",
      "SF",
      "호러",
      "무협",
      "일상",
      "학원",
      "이세계",
      "아포칼립스",
      "사이버펑크",
      "코미디",
      "액션",
      "추리",
      "현대",
      "전쟁",
      "스포츠",
      "서바이벌",
      "시뮬레이션",
      "사극",
      "범죄",
      "게임",
      "RPG",
      "BL",
      "GL",
      "HL",
    ],
  },
  {
    title: "folderBackground",
    tags: [
      "학교",
      "회사",
      "병원",
      "카페",
      "던전",
      "우주선",
      "왕궁",
      "시골",
      "도시",
      "바다",
      "산장",
      "지하철",
      "편의점",
      "기숙사",
      "놀이공원",
      "결혼식장",
      "헬스장",
      "서점",
    ],
  },
  {
    title: "folderRace",
    tags: [
      "뱀파이어",
      "엘프",
      "드래곤",
      "수인",
      "악마",
      "천사",
      "요괴",
      "안드로이드",
      "구미호",
      "외계인",
      "몬스터",
      "서큐버스",
      "인큐버스",
      "늑대인간",
      "유령",
      "인외",
    ],
  },
  {
    title: "folderCharacter",
    tags: [
      "남자친구",
      "여자친구",
      "누나",
      "여동생",
      "오빠",
      "언니",
      "엄마",
      "아빠",
      "소꿉친구",
      "학생",
      "일진",
      "오타쿠",
      "히키코모리",
      "영애",
      "악역",
      "니트",
    ],
  },
  {
    title: "folderAppearance",
    tags: [
      "갈발",
      "은발",
      "흑발",
      "붉은머리",
      "안경",
      "근육",
      "교복",
      "문신",
      "거유",
      "빈유",
      "슬렌더",
      "장신",
      "톰보이",
      "수염",
      "중성",
      "창백",
      "눈가림",
      "단발",
      "소년",
      "소녀",
    ],
  },
  {
    title: "folderPersonality",
    tags: [
      "츤데레",
      "얀데레",
      "쿠데레",
      "다정",
      "능글",
      "집착",
      "발랄",
      "무뚝뚝",
      "걸크러시",
      "수줍음",
      "순수",
      "멘헤라",
      "소악마",
      "사이코패스",
      "소시오패스",
      "광기",
      "음침",
      "도도",
      "애교",
      "대담한",
      "지배적",
      "피폐",
      "천연",
      "카리스마",
      "권력",
      "무심",
      "쿨데레",
    ],
  },
  {
    title: "folderRelationship",
    tags: [
      "친구",
      "연인",
      "비밀연애",
      "가짜연애",
      "주인",
      "라이벌",
      "룸메이트",
      "상사",
      "부하",
      "동료",
      "부부",
      "스승",
      "제자",
      "선배",
      "후배",
      "사내연애",
      "연상",
      "연하",
    ],
  },
  {
    title: "folderNarrative",
    tags: [
      "구원",
      "복수",
      "함정",
      "재회",
      "배신",
      "환생",
      "회귀",
      "빙의",
      "짝사랑",
      "첫사랑",
      "결혼",
      "왕따",
      "감금",
      "기억상실",
      "트라우마",
      "계약",
      "반전",
      "가스라이팅",
      "암살",
      "데이터",
      "감성",
      "순애",
      "육성",
      "타락",
      "권태기",
    ],
  },
  {
    title: "folderOccupation",
    tags: [
      "의사",
      "군인",
      "경찰",
      "교사",
      "메이드",
      "집사",
      "아이돌",
      "스트리머",
      "배우",
      "기사",
      "용사",
      "마법사",
      "암살자",
      "스파이",
      "헌터",
      "탐정",
      "킬러",
      "공주",
      "여왕",
      "성녀",
      "마녀",
      "CEO",
      "재벌",
      "조폭",
      "마피아",
      "회사원",
      "과학자",
      "퇴마사",
      "히어로",
      "간호사",
      "해적",
      "정보원",
      "빌런",
    ],
  },
  {
    title: "folderMood",
    tags: [
      "힐링",
      "다크",
      "잔잔",
      "몽환적",
      "긴장감",
      "코믹",
      "스릴러",
      "감성적",
      "청춘",
      "잔혹",
      "몽글몽글",
      "새드",
      "훈훈",
      "미스터리",
      "로맨틱",
      "웅장함",
    ],
  },
  {
    title: "folderSpecial",
    tags: [
      "하렘",
      "역하렘",
      "이종인격",
      "초능력",
      "TS",
      "오메가버스",
      "세뇌",
      "최면",
      "먼치킨",
      "변신",
      "오토코노코",
      "패러디",
    ],
  },
];

interface TagSidebarProps {
  selectedTags: string[];
  onSelectedTagsChange: Dispatch<SetStateAction<string[]>>;
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
  selectedTags,
  onSelectedTagsChange,
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

    const labelsByCategory = new Map<string, string[]>();
    apiTags.forEach((tag) => {
      const labels = labelsByCategory.get(tag.category) ?? [];
      labels.push(tag.label);
      labelsByCategory.set(tag.category, labels);
    });

    return HASHTAG_CATEGORY_ORDER.filter((category) =>
      labelsByCategory.has(category),
    ).map((category) => ({
      title: HASHTAG_CATEGORY_FOLDER_TITLE_KEYS[category],
      tags: labelsByCategory.get(category) ?? [],
    }));
  }, [hashtagList]);

  // 검색어가 있으면 각 폴더의 태그를 필터링하고, 결과가 없는 폴더는 숨깁니다.
  // 데이터 원본(TAG_FOLDERS)은 건드리지 않도록 map/filter 결과만 렌더링합니다.
  const filteredFolders = useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return tagFolders;

    return tagFolders
      .map((folder) => ({
        ...folder,
        tags: folder.tags.filter((tag) => tag.includes(trimmedQuery)),
      }))
      .filter((folder) => folder.tags.length > 0);
  }, [query, tagFolders]);

  // 태그를 누를 때 선택/해제를 토글합니다.
  // 선택된 태그는 하단 "선택 태그" 영역에도 같은 상태로 표시됩니다.
  const toggleTag = (tag: string) => {
    onSelectedTagsChange((prev) =>
      prev.includes(tag)
        ? prev.filter((selectedTag) => selectedTag !== tag)
        : [...prev, tag],
    );
  };

  // 추천 카드는 여러 태그를 한 번에 추가합니다.
  // Set을 사용해서 이미 선택된 태그가 중복으로 쌓이지 않게 합니다.
  const selectRecommendation = (tags: string[]) => {
    onSelectedTagsChange((prev) => Array.from(new Set([...prev, ...tags])));
  };

  return (
    <aside className="sticky top-[0px] h-[calc(100vh-var(--header-height))] w-[300px] shrink-0 overflow-y-auto bg-dark no-scrollbar">
      {/* 검색 영역: 입력값은 폴더 태그 목록을 클라이언트에서 즉시 필터링합니다. */}
      <div className="px-5 py-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-font-2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-[43px] w-full rounded-xl border border-main bg-darkest pl-[38px] pr-3 body-5 text-font-1 outline-none transition-colors placeholder:text-font-2 focus:border-font-disabled"
          />
        </label>
      </div>

      {/* 선택 태그 영역: 현재 선택된 태그를 모아 보여주고 개별/전체 해제가 가능합니다. */}
      <section className="border-y border-main px-5 pb-8 pt-6">
        <header className="mb-3 flex h-[21px] items-center justify-between">
          <h2 className="title-6 text-font-2">{t("selectedTags")}</h2>
          <button
            type="button"
            onClick={() => onSelectedTagsChange([])}
            className="body-6 text-font-2 underline-offset-2 hover:underline"
          >
            {t("clearAll")}
          </button>
        </header>

        <div className="flex flex-wrap content-start gap-2">
          {selectedTags.map((tag) => (
            <TagPill
              key={tag}
              label={tag}
              size="lg"
              isSelected
              onRemove={() => toggleTag(tag)}
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
          <p className="body-5 py-10 text-center text-font-disabled">
            {t("emptyHashtags")}
          </p>
        ) : (
          filteredFolders.map((folder) => (
            <TagFolder
              key={folder.title}
              title={t.has(folder.title) ? t(folder.title) : folder.title}
              tags={folder.tags}
              selectedTags={selectedTags}
              onTagToggle={toggleTag}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default TagSidebar;
