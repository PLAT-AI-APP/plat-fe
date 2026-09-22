"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import { MainBannerCarousel } from "@/app/(main)/_components/MainBannerCarousel";
import { cn } from "@/lib/utils";
import MenuTab from "./MenuTab";

/*
 * 탭 다섯 개를 정적으로 가져오면 한 번에 하나만 그리는데도 다섯 트리가 전부
 * 번들에 들어간다. 실제로 홈 탭에서 카테고리 탭의 TagSidebar·태그 상수까지
 * 내려받고 있었다(카테고리 탭 하나가 framer-motion 과 300줄짜리 태그 상수를
 * 끌고 온다). 각자 청크로 나눠 고른 탭만 받게 한다.
 *
 * ssr:false 는 쓰지 않는다 — 첫 화면이 비어 보이는 대가가 크다.
 * 여기서 필요한 건 코드 분할뿐이다.
 */
const TAB_COMPONENTS = {
  all: dynamic(() => import("./home-tab-contents")),
  ranking: dynamic(() => import("./ranking-tab-contents")),
  new: dynamic(() => import("./new-tab-contents")),
  official: dynamic(() => import("./official-tab-contents")),
  categories: dynamic(() => import("./categories-tab-contents")),
} as const;

type HomeTab = keyof typeof TAB_COMPONENTS;

const isHomeTab = (value: unknown): value is HomeTab =>
  typeof value === "string" && value in TAB_COMPONENTS;

/**
 * 홈 본문. 탭은 서버가 아니라 여기서 주소를 읽어 고른다.
 *
 * 예전에는 서버 page 가 searchParams 로 탭을 골랐다. 그러면 탭을 누를 때마다 서버 렌더를 다시
 * 받아야 했고, 그동안 (main)/loading.tsx 가 배너·탭까지 페이지 전체를 로딩 화면으로 가렸다.
 * 이제 탭은 주소만 바꾸고(ShallowLink) 여기서 useSearchParams 로 따라간다.
 */
const HomeContents = () => {
  const tab = useSearchParams().get("tab");
  // 주소로 아무 값이나 들어올 수 있으므로 아는 탭인지 먼저 확인한다.
  const currentTab: HomeTab = isHomeTab(tab) ? tab : "all";
  const TabContents = TAB_COMPONENTS[currentTab];

  const isCategories = currentTab === "categories";

  return (
    <article
      id="home-container"
      className={cn(
        "w-full min-h-[calc(100dvh-var(--header-height))] flex",
        isCategories && "bg-darker",
      )}
    >
      {/* 메인 콘텐츠 영역: min-w-0이 없으면 이 flex item이 콘텐츠의 min-content 폭 밑으로 줄어들지 못해,
          화면이 좁아졌을 때 오른쪽 태그 사이드바가 컨테이너 밖으로 밀려나 잘려 보입니다. */}
      <section className="flex min-w-0 flex-col w-full min-h-[calc(100dvh-var(--header-height))]">
        {/* 메인 비주얼/슬라이드 영역: 카테고리 탭을 제외하고 항상 노출되고, 아래 탭 콘텐츠만 바뀝니다.
            카테고리 탭은 배경(bg-darker)과 태그 사이드바가 있는 별도 레이아웃이라 배너를 얹지 않습니다. */}
        <PageTitle messageKey="pageTitles.home" />

        {!isCategories && <MainBannerCarousel />}

        <div className="content-shell @container flex flex-1 flex-col">
          <MenuTab currentTab={currentTab} />
          {/* <OverflowTagList
            maxLines={1}
            tags={[
              {
                id: "tag-1",
                label: "소꿉친구",
              },
              {
                id: "tag-2",
                label: "장난스러움",
              },
              {
                id: "tag-3",
                label: "츤데레",
              },
              {
                id: "tag-4",
                label: "학교",
              },
              {
                id: "tag-5",
                label: "청춘",
              },
              {
                id: "tag-6",
                label: "짝사랑",
              },
              {
                id: "tag-7",
                label: "일상",
              },
              {
                id: "tag-8",
                label: "일상",
              },
              {
                id: "tag-9",
                label: "일상",
              },
            ]}
          /> */}
          <div
            id="contents-wrapper"
            className="flex flex-col grow w-full pb-12"
          >
            <TabContents />
          </div>

          <div className="shrink-0 w-full">
            <Footer />
          </div>
        </div>
      </section>

      {/* 사이드바 영역: CategoriesTabContents가 선택 태그 상태를 소유하고 이 위치로 렌더링합니다. */}
      {isCategories && (
        <>
          <div id="categories-tag-sidebar-root" className="contents" />
          {/*
            태그 사이드바는 하이드레이션이 끝난 뒤 위 자리로 포털된다. 그 전까지 자리가 비어 있으면
            카드 그리드가 전체 폭으로 그려졌다가 300px 줄어들며 튀었다. 같은 폭을 미리 잡아 두고,
            사이드바가 들어오면(자리가 비어 있지 않으면) CSS 로 숨긴다.
          */}
          <div
            aria-hidden="true"
            className="hidden w-[300px] shrink-0 lg:block [#categories-tag-sidebar-root:not(:empty)~&]:hidden"
          />
        </>
      )}
    </article>
  );
};

export default HomeContents;
