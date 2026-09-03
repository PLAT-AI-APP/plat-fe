import Footer from "@/components/Footer";
import { MainBannerCarousel } from "@/app/(main)/_components/MainBannerCarousel";
import MenuTab from "./_components/MenuTab";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import HomeTabContents from "./_components/home-tab-contents";
import RankingTabContents from "./_components/ranking-tab-contents";
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
    all: <HomeTabContents />,
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
      {/* 메인 콘텐츠 영역: min-w-0이 없으면 이 flex item이 콘텐츠의 min-content 폭 밑으로 줄어들지 못해,
          화면이 좁아졌을 때 오른쪽 태그 사이드바가 컨테이너 밖으로 밀려나 잘려 보입니다. */}
      <section className="flex min-w-0 flex-col w-full min-h-[calc(100vh-var(--header-height))]">
        {/* 메인 비주얼/슬라이드 영역: 탭과 무관하게 항상 노출되고, 아래 탭 콘텐츠만 바뀝니다. */}
        <PageTitle messageKey="pageTitles.home" />

        <MainBannerCarousel />

        <div className="w-full max-w-300 mx-auto @container flex-1 flex flex-col content-x">
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
            {TabComponents[currentTab]}
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
