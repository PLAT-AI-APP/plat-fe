"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CharacterShowcase from "../CharacterShowcase";
import SearchResultSort from "./_components/SearchResultSort";
import TagSidebar, { INITIAL_SELECTED_TAGS } from "./_components/tag-sidebar";
import CharacterCreatePrompt from "./_components/CharacterCreatePrompt";

export const DUMMY_CHARACTERS = [
  {
    id: "398292",
    name: "옆자리 불량학생",
    creatorName: "플랫메이커", // 새로 추가된 속성
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "고교생", "츤데레"],
    img: "/images/sample.png", // URL 대신 실제 사용하실 샘플 이미지로 변경
  },
  {
    id: "398293",
    name: "다정한 동아리 선배",
    creatorName: "로맨스장인",
    dec: "언제나 나를 챙겨주는 다정한 사진부 선배와의 두근거리는 일상",
    tag: ["학교", "선배", "다정", "로맨스"],
    img: "/images/sample.png",
  },
  {
    id: "398294",
    name: "비밀을 아는 소꿉친구",
    creatorName: "스토리텔러",
    dec: "10년 지기 소꿉친구가 내 흑역사를 빌미로 장난을 치기 시작했다.",
    tag: ["일상", "소꿉친구", "장난스러움", "개그"],
    img: "/images/sample.png",
  },
  {
    id: "398295",
    name: "냉혹한 황태자",
    creatorName: "판타지조아",
    dec: "피도 눈물도 없는 제국의 황태자. 하지만 내게만은 다르다?",
    tag: ["판타지", "카리스마", "연상", "로맨스"],
    img: "/images/sample.png",
  },
  // 필요에 따라 객체를 더 복사해서 사용하세요.
];

const CategoriesTabContents = () => {
  const t = useTranslations("categoriesPage");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    INITIAL_SELECTED_TAGS,
  );
  const [sidebarRoot, setSidebarRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSidebarRoot(document.getElementById("categories-tag-sidebar-root"));
  }, []);

  return (
    <>
      <article className="flex flex-col gap-18 w-full mt-7 bg-bg-darker">
        {/* 검색결과 */}
        <div className="flex-1 flex flex-col gap-7 justify-start">
          <header className="flex items-center justify-between heading-3R">
            <p>
              {t("searchResults")}{" "}
              <span className="heading-3">
                {t("resultCount", { count: 12 })}
              </span>
            </p>

            <SearchResultSort />
          </header>

          <CharacterShowcase
            charArray={DUMMY_CHARACTERS}
            cardSize="S"
            columnGap={16}
            rowGap={28}
            selectedTags={selectedTags}
          />
        </div>

        {/* 플랫에서 추천하는 캐릭터 */}
        <div className="flex-1 flex flex-col gap-4.5 justify-start">
          <header className="flex flex-col heading-3">
            <p>{t("recommendedCharacters")}</p>

            <p className="body-2 text-font-2">{t("recommendedDescription")}</p>
          </header>

          <CharacterShowcase
            charArray={DUMMY_CHARACTERS}
            cardSize="S"
            columnGap={16}
            rowGap={28}
            selectedTags={selectedTags}
          />
        </div>
        <CharacterCreatePrompt />
      </article>

      {sidebarRoot &&
        createPortal(
          <TagSidebar
            selectedTags={selectedTags}
            onSelectedTagsChange={setSelectedTags}
          />,
          sidebarRoot,
        )}
    </>
  );
};

export default CategoriesTabContents;
