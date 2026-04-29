import Footer from "@/components/Footer";
import { MainBannerCarousel } from "@/app/(main)/_components/MainBannerCarousel";
import MenuTab from "./_components/MenuTab";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import HomeTabContents from "./_components/home-tab-contents";
import RankingTabContents from "./_components/ranking-tab-contents";
import { CHARACTERS_DUMMY } from "@/mocks/dummyData";

export const metadata: Metadata = {
  title: "home",
};

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
const Home = async ({ searchParams }: HomePageProps) => {
  const params = await searchParams;
  // 쿼리스트링 'tab' 값을 가져옵니다. (기본값: 'all')
  const currentTab =
    (params.tab as "all" | "ranking" | "new" | "official" | "categories") ||
    "all";

  const TabComponents: { [key: string]: React.ReactNode } = {
    all: <HomeTabContents charArray={CHARACTERS_DUMMY} />,
    ranking: <RankingTabContents />,
    // new: <NewContent />,
    // official: <OfficialContent />,
  };

  return (
    <article
      id="home-container"
      className={cn(
        "@container w-full mx-auto max-w-300",
        "px-5 md:px-6 lg:px-8",
        "flex flex-col", // 내부 배치를 위해 flex는 유지하되 높이 강제 X
      )}
    >
      <div className="flex flex-col gap-7.5 w-full">
        {/* 메인 비주얼/슬라이드 영역 */}
        <MainBannerCarousel />

        <div className="max-w-300 w-full flex flex-col mx-auto gap-6.5 items-center">
          {/* 카테고리 필터 영역 */}
          <MenuTab currentTab={currentTab} />

          <div
            id="contents-wrapper"
            className="flex flex-col gap-15 w-full mx-auto"
          >
            {TabComponents[currentTab]}
          </div>
        </div>
      </div>

      <Footer />
    </article>
  );
};

export default Home;
