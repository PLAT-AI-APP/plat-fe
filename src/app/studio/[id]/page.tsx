import { Metadata } from "next";
import React from "react";
import Header from "./_components/Header";
import CharacterList from "./_components/character-list";
import ViewToggle from "./_components/ViewToggle";
import StudioStats from "./_components/StudioStats";
import CharacterCreateBanner from "./_components/CharacterCreateBanner";
import CharacterGrid from "@/components/character/CharacterGrid";
import { DUMMY_CHARACTERS as CharArray } from "./_components/dummyData";
import SortFilter from "./_components/SortFilter";

export const metadata: Metadata = {
  title: "스튜디오",
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const StudioPage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const sParams = await searchParams;

  const viewMode = (sParams.view as "list" | "grid") || "list";
  const sort = (sParams.sort as "최신순" | "채팅순") || "최신순";

  return (
    <section className="@container mx-auto w-full max-w-175 pt-7.5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 p-5 rounded-3xl border border-border-main bg-bg-darker">
            {/* 팔로워 / 팔로잉 / 프로필Img 등 영역 */}
            <Header id={id} />
            <hr className="text-border-main" />
            {/* 생성한 캐릭터 수 / 채팅수 / 본인인증 여부 / 성인인증 여부 */}
            <StudioStats />
          </div>

          {/* 캐릭터 제작 권장/ 캐릭터 제작 경로로 이동 */}
          <CharacterCreateBanner />
        </div>

        <div className="flex flex-col gap-2">
          <header className="flex items-center justify-between py-1.5 px-2.5">
            <span className="text-font-2 title-5">
              작품목록 {CharArray.length}
            </span>

            <div className="flex gap-1 items-center">
              {/* 세로 list형식 / 가로 grid 형식 toggle  */}
              <ViewToggle viewMode={viewMode} />
              {/* default=최신순 / 채팅순 선택 button */}
              <SortFilter currentSort={sort} />
            </div>
          </header>

          {/* 내가 생성한 캐릭터 view 영역 */}
          {CharArray.length <= 0 ? (
            // 내가 생성한 캐릭터가 없을 경우 처리
            <div className="flex items-center justify-center w-full h-50">
              <div className="flex flex-col gap-1 text-center">
                <span className="text-font-2">아직 캐릭터가 없어요</span>
                <span className="text-xs text-font-disabled">
                  나만의 매력적인 AI 캐릭터를 만들어보세요
                </span>
              </div>
            </div>
          ) : viewMode === "list" ? (
            <CharacterList char={CharArray} />
          ) : (
            <CharacterGrid
              rowGap={12}
              columnGap={12}
              char={CharArray}
              cardClassName="min-w-37.5 max-w-60"
              gridClassName="grid-cols-2 @[474px]:grid-cols-3 @[636px]:grid-cols-4"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default StudioPage;
