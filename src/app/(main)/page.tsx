import Footer from "@/components/Footer";
import { MainBannerCarousel } from "@/app/(main)/_components/MainBannerCarousel";
import MenuTab from "./_components/MenuTab";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import HomeTabContents from "./_components/home-tab-contents";
import RankingTabContents from "./_components/ranking-tab-contents";
import { CHARACTERS_DUMMY } from "@/mocks/dummyData";
import CategoriesTabContents from "./_components/categories-tab-contents";
import TagSidebar from "./_components/categories-tab-contents/_components/tag-sidebar";

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
    categories: <CategoriesTabContents />,
    // new: <NewContent />,
    // official: <OfficialContent />,
  };

  const isCategories = currentTab === "categories";
  return (
    <article
      id="home-container"
      className={cn(
        "w-full min-h-[calc(100vh-60px)]",
        "flex",
        isCategories && "bg-bg-darker",
      )}
    >
      {/* 카테고리 tab전용 태그 탐색 sidebar */}
      {isCategories && <TagSidebar />}

      <section
        className={cn("w-full min-h-[calc(100vh-60px)]", "flex flex-col")}
      >
        {/* 메인 비주얼/슬라이드 영역 */}
        {currentTab === "all" && <MainBannerCarousel />}

        <div className="w-full flex-1 max-w-300 mx-auto @container flex flex-col">
          {/* 카테고리 필터 영역 */}
          <MenuTab currentTab={currentTab} />

          {/* 본문+푸터 영역 */}
          <div className="w-full flex flex-col flex-1">
            <div id="contents-wrapper" className="flex flex-col w-full flex-1">
              {TabComponents[currentTab]}
            </div>

            <div className="mt-auto">
              <Footer />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Home;
