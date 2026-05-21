import Footer from "@/components/Footer";
import { MainBannerCarousel } from "@/app/(main)/_components/MainBannerCarousel";
import MenuTab from "./_components/MenuTab";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import HomeTabContents from "./_components/home-tab-contents";
import RankingTabContents from "./_components/ranking-tab-contents";
import { CHARACTERS_DUMMY } from "@/mocks/dummyData";
import CharacterCreateBanner from "./_components/CharacterCreateBanner";

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
    // new: <NewContent />,
    // official: <OfficialContent />,
  };

  return (
    <article
      id="home-container"
      className={cn(
        "w-full min-h-screen", // w-screen 대신 모바일 가로 스크롤 방지를 위해 w-full 권장
        "flex flex-col",
      )}
    >
      {/* 메인 비주얼/슬라이드 영역 (화면 전체 너비 100% 꽉 채움) */}
      <MainBannerCarousel />

      {/* 하단 콘텐츠 영역 전체를 감싸는 컨테이너 (중앙 정렬 + 양옆 여백 균등 적용) */}
      <div className="w-full max-w-300 mx-auto @container flex flex-col">
        {/* 카테고리 필터 영역 */}
        <MenuTab currentTab={currentTab} />

        {/* 본문 콘텐츠 + 배너 + 푸터 영역 */}
        <div className="w-full flex flex-col gap-18">
          <div id="contents-wrapper" className="flex flex-col gap-15 w-full">
            {TabComponents[currentTab]}
          </div>

          <CharacterCreateBanner />

          <Footer />
        </div>
      </div>
    </article>
  );
};

export default Home;
