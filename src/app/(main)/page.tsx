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
    categories: <CategoriesTabContents />,
  };

  const isCategories = currentTab === "categories";

  return (
    <article
      id="home-container"
      className={cn(
        "w-full min-h-[calc(100vh-60px)] flex",
        isCategories && "bg-bg-darker",
      )}
    >
      {/* 메인 콘텐츠 영역 */}
      <section className="flex flex-col w-full min-h-[calc(100vh-60px)]">
        {/* 메인 비주얼/슬라이드 영역 */}
        {currentTab === "all" && <MainBannerCarousel />}

        <div className="w-full max-w-300 mx-auto @container flex-1 flex flex-col">
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
          <div id="contents-wrapper" className="flex flex-col grow w-full">
            {TabComponents[currentTab]}
          </div>

          <div className="shrink-0 w-full">
            <Footer />
          </div>
        </div>
      </section>

      {/* 사이드바 영역 */}
      {isCategories && <TagSidebar />}
    </article>
  );
};

export default Home;
