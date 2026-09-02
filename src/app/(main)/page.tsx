import Footer from "@/components/Footer";
import { MainBannerCarousel } from "@/app/(main)/_components/MainBannerCarousel";
import MenuTab from "./_components/MenuTab";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import HomeTabContents from "./_components/home-tab-contents";
import RankingTabContents from "./_components/ranking-tab-contents";
import { CHARACTERS_DUMMY } from "@/mocks/dummyData";
import CategoriesTabContents from "./_components/categories-tab-contents";
import OfficialTabContents from "./_components/official-tab-contents";
import NewTabContents from "./_components/new-tab-contents";
import PageTitle from "@/components/PageTitle";
// import OverflowTagList from "@/components/OverflowTagList";

export const metadata: Metadata = {
  title: "home",
};

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Home = async ({ searchParams }: HomePageProps) => {
  const params = await searchParams;
  const currentTab =
    (params.tab as "all" | "ranking" | "new" | "official" | "categories") ||
    "all";

  const TabComponents: { [key: string]: React.ReactNode } = {
    all: <HomeTabContents charArray={CHARACTERS_DUMMY} />,
    ranking: <RankingTabContents />,
    new: <NewTabContents />,
    official: <OfficialTabContents />,
    categories: <CategoriesTabContents />,
  };

  const isCategories = currentTab === "categories";

  return (
    <article
      id="home-container"
      className={cn(
        "w-full min-h-[calc(100vh-var(--header-height))] flex",
        isCategories && "bg-darker",
      )}
    >
      <section className="flex min-w-0 flex-col w-full min-h-[calc(100vh-var(--header-height))]">
        {/* 메인 비주얼/슬라이드 영역: 탭과 무관하게 항상 노출되지만, 카테고리 탭은 태그 필터링에
            집중하는 화면이라 배너를 뺍니다. */}
        <PageTitle messageKey="pageTitles.home" />

        {!isCategories && <MainBannerCarousel />}

        {/* 바깥 행(row)에는 padding을 두지 않아, 오른쪽 태그 사이드바가 뷰포트 오른쪽 끝에
            그대로 닿을 수 있습니다. content-x(x축 여백)는 사이드바를 뺀 왼쪽 칸에만 줘서
            메인 콘텐츠만 여백을 갖습니다. position(fixed/absolute)은 전혀 쓰지 않습니다. */}
        <div className="flex w-full min-w-0 flex-1">
          {/* 왼쪽 칸: 남는 폭을 모두 가져가되(flex-1) 안쪽 max-w-300 + items-center로
              왼쪽 공용 사이드바 ~ 오른쪽 태그 사이드바 사이에서 다시 가운데 정렬됩니다. */}
          <div className="flex min-w-0 flex-1 flex-col content-x">
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <div className="w-full max-w-300 @container flex-1 flex flex-col">
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
                  className="flex w-full flex-col pb-12"
                >
                  {TabComponents[currentTab]}
                </div>

                <div className="shrink-0 w-full">
                  <Footer />
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 영역: CategoriesTabContents가 선택 태그 상태를 소유하고 이 위치로 렌더링합니다.
              content-x가 적용되지 않은 바깥 행의 flex item(고정폭 300px)이라, position 없이도
              항상 뷰포트 오른쪽 끝에 그대로 붙습니다. */}
          {isCategories && (
            <div id="categories-tag-sidebar-root" className="contents" />
          )}
        </div>
      </section>
    </article>
  );
};

export default Home;
