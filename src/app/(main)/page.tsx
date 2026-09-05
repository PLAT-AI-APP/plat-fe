import Footer from "@/components/Footer";
import { MainBannerCarousel } from "@/app/(main)/_components/MainBannerCarousel";
import MenuTab from "./_components/MenuTab";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import PageTitle from "@/components/PageTitle";
// import OverflowTagList from "@/components/OverflowTagList";

export const metadata: Metadata = {
  title: "home",
};

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/*
 * 탭 다섯 개를 정적으로 가져오면 한 번에 하나만 그리는데도 다섯 트리가 전부
 * 번들에 들어간다. 실제로 홈 탭에서 카테고리 탭의 TagSidebar·태그 상수까지
 * 내려받고 있었다(카테고리 탭 하나가 framer-motion 과 300줄짜리 태그 상수를
 * 끌고 온다). 각자 청크로 나눠 고른 탭만 받게 한다.
 *
 * ssr:false 는 쓰지 않는다 — 서버 컴포넌트에서는 허용되지 않고, 첫 화면이
 * 비어 보이는 대가도 크다. 여기서 필요한 건 코드 분할뿐이다.
 */
const TAB_COMPONENTS = {
  all: dynamic(() => import("./_components/home-tab-contents")),
  ranking: dynamic(() => import("./_components/ranking-tab-contents")),
  new: dynamic(() => import("./_components/new-tab-contents")),
  official: dynamic(() => import("./_components/official-tab-contents")),
  categories: dynamic(() => import("./_components/categories-tab-contents")),
} as const;

type HomeTab = keyof typeof TAB_COMPONENTS;

const isHomeTab = (value: unknown): value is HomeTab =>
  typeof value === "string" && value in TAB_COMPONENTS;

const Home = async ({ searchParams }: HomePageProps) => {
  const params = await searchParams;
  // 주소로 아무 값이나 들어올 수 있으므로 아는 탭인지 먼저 확인한다.
  const currentTab: HomeTab = isHomeTab(params.tab) ? params.tab : "all";
  const TabContents = TAB_COMPONENTS[currentTab];

  const isCategories = currentTab === "categories";

  return (
    <article
      id="home-container"
      className={cn(
        "w-full min-h-[calc(100vh-var(--header-height))] flex",
        isCategories && "bg-darker",
      )}
    >
      {/* 메인 콘텐츠 영역: min-w-0이 없으면 이 flex item이 콘텐츠의 min-content 폭 밑으로 줄어들지 못해,
          화면이 좁아졌을 때 오른쪽 태그 사이드바가 컨테이너 밖으로 밀려나 잘려 보입니다. */}
      <section className="flex min-w-0 flex-col w-full min-h-[calc(100vh-var(--header-height))]">
        {/* 메인 비주얼/슬라이드 영역: 탭과 무관하게 항상 노출되고, 아래 탭 콘텐츠만 바뀝니다. */}
        <PageTitle messageKey="pageTitles.home" />

        <MainBannerCarousel />

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
        <div id="categories-tag-sidebar-root" className="contents" />
      )}
    </article>
  );
};

export default Home;
