import CharacterGrid from "@/components/character/CharacterGrid";
import Logo from "@/icons/Logo";
import New from "@/icons/New";
import React from "react";

interface HomeTabContentsProps {
  charArray: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
  }[];
}
const HomeTabContents = ({ charArray }: HomeTabContentsProps) => {
  return (
    <div className="flex flex-col gap-15">
      {/* 오늘의 PICK 섹션 */}
      <section
        id="today-pick-section"
        className="w-full h-auto max-w-300 flex flex-col gap-4 justify-center"
      >
        <CharacterGrid
          char={charArray}
          // lineCount={2}
          cardHeight={281}
          columnGap={12}
          rowGap={12}
          title="오늘의 PICK"
        />
      </section>

      {/* 추천 신작 섹션 */}
      <section id="trending-new-section" className="flex flex-col gap-4">
        <CharacterGrid
          char={charArray}
          // lineCount={1}
          cardHeight={281}
          //   isNew={true}
          title="떠오르는 추천 신작"
          TitleLogo={<New className="w-4.5 h-4.5" />}
          moreLink="new"
        />
      </section>

      {/* 공식 캐릭터 섹션 */}
      <section id="official-characters-section" className="flex flex-col gap-4">
        <CharacterGrid
          char={charArray}
          // lineCount={1}
          cardHeight={281}
          //   isOfficial={true}
          title="플랫의 공식 캐릭터"
          TitleLogo={<Logo className="w-4.5 h-4.5" />}
          moreLink="official"
        />
      </section>
    </div>
  );
};

export default HomeTabContents;
