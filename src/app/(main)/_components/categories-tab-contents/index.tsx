"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Tag from "@/icons/Tag";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TABLET_MAX_WIDTH_QUERY } from "@/constants/layout";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import SearchResultSort from "./_components/SearchResultSort";
import TagSidebar from "./_components/tag-sidebar";
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
  {
    id: "398296",
    name: "사이버펑크 해커 리온",
    creatorName: "네온드리머",
    dec: "네온 사인이 깜빡이는 뒷골목. 어떤 정보를 찾으러 왔어?",
    tag: ["사이버펑크", "해커", "도시", "미스터리"],
    img: "/images/sample.png",
  },
  {
    id: "398297",
    name: "판타지 엘프 마법사",
    creatorName: "숲의이야기꾼",
    dec: "고대 숲의 깊은 곳. 은빛 머리카락이 흩날리는 그녀가 손을 내밉니다.",
    tag: ["판타지", "엘프", "마법", "숲"],
    img: "/images/sample.png",
  },
  {
    id: "398298",
    name: "냉혹한 춤꾼",
    creatorName: "무대위의그림자",
    dec: "음악이 멈추면 모든 게 끝나는 거야. 마지막 춤을 출 준비는 됐어?",
    tag: ["느와르", "카리스마", "긴장감"],
    img: "/images/sample.png",
  },
  {
    id: "398299",
    name: "우주 정거장 AI 안나",
    creatorName: "스페이스오페라",
    dec: "현재 산소 포화도 98%입니다. 다음 목적지 궤도를 수정할까요?",
    tag: ["SF", "우주", "AI", "미래"],
    img: "/images/sample.png",
  },
  {
    id: "398300",
    name: "조선 시대 무사 강혁",
    creatorName: "역사덕후",
    dec: "이 칼 끝은 오직 정의만을 향한다. 도적이 이곳에 숨어 있다고 생각하느냐?",
    tag: ["사극", "무사", "정의", "액션"],
    img: "/images/sample.png",
  },
  // 필요에 따라 객체를 더 복사해서 사용하세요.
];

const CategoriesTabContents = () => {
  const t = useTranslations("categoriesPage");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  // 태블릿 폭에서는 300px 고정폭 사이드바가 카드 그리드를 압박하므로 인라인
  // 배치 대신 토글로 열고 닫는 오버레이 패널로 전환합니다.
  const isTablet = useMediaQuery(TABLET_MAX_WIDTH_QUERY);
  const [isTagSidebarOpen, setIsTagSidebarOpen] = useState(false);

  useEffect(() => {
    // 포털 렌더링은 hydration 이후로 미뤄 서버/클라이언트 초기 HTML을 맞춥니다.
    const frameId = requestAnimationFrame(() => setIsHydrated(true));

    return () => cancelAnimationFrame(frameId);
  }, []);

  const sidebarRoot = isHydrated
    ? document.getElementById("categories-tag-sidebar-root")
    : null;

  return (
    <>
      <article className="flex flex-col gap-12 w-full mt-6 bg-darker">
        {/* 검색결과 */}
        <div className="flex-1 flex flex-col gap-7 justify-start">
          <header className="flex items-center justify-between heading-3R">
            <p>
              {t("searchResults")}{" "}
              <span className="heading-3">
                {t("resultCount", { count: 12 })}
              </span>
            </p>

            <div className="flex items-center gap-3">
              {isTablet && (
                <button
                  type="button"
                  onClick={() => setIsTagSidebarOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-main px-3 py-2 body-4 text-font-1 transition-colors hover:bg-btn-hover"
                >
                  <Tag className="size-4" />
                  {t("tagFilter")}
                </button>
              )}
              <SearchResultSort />
            </div>
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
        <div className="flex-1 flex flex-col gap-4 justify-start">
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
            isOverlay={isTablet}
            isOpen={isTagSidebarOpen}
            onClose={() => setIsTagSidebarOpen(false)}
          />,
          sidebarRoot,
        )}
    </>
  );
};

export default CategoriesTabContents;
