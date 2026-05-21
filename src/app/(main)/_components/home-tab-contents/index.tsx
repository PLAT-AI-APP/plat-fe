import New from "@/icons/New";
import React from "react";
import CharacterShowcase from "./_components/CharacterShowcase";
import CharacterExperience from "./_components/character-experience";

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
      <CharacterShowcase
        charArray={charArray}
        title="오늘의 PICK"
        allViewLink=""
        cardSize="M"
        limit={5}
      />

      {/* 플랫의 공식 캐릭터 맛보기 섹션 */}
      <CharacterExperience />

      {/* ~한 캐릭터 모음 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title="~한 캐릭터 모음"
        allViewLink=""
        cardSize="L"
        limit={8}
      />

      {/* 인기 캐릭터 이미지 미리보기 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title="인기 캐릭터 이미지 미리보기"
        allViewLink=""
        cardSize="XL"
        limit={3}
      />

      {/* 최근 소문나기 시작한 신작 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title="최근 소문나기 시작한 신작"
        allViewLink="new"
        cardSize="M"
        limit={10}
        TitleLogo={<New className="w-4.5 h-4.5" />}
        columnGap={16}
        rowGap={28}
      />

      {/* ~~님을 위한 추천 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title="~~님을 위한 추천"
        allViewLink="asf"
        cardSize="S"
        limit={18}
        columnGap={17}
        rowGap={28}
      />

      {/* 추천 신작 섹션 */}
      {/* <section id="trending-new-section" className="flex flex-col gap-4">
        <CharacterGrid
          char={charArray}
          // lineCount={1}
          //   isNew={true}
          title="떠오르는 추천 신작"
          TitleLogo={<New className="w-4.5 h-4.5" />}
          moreLink="new"
        />
      </section> */}

      {/* 공식 캐릭터 섹션 */}
      {/* <section id="official-characters-section" className="flex flex-col gap-4">
        <CharacterGrid
          char={charArray}
          // lineCount={1}
          cardHeight={281}
          //   isOfficial={true}
          title="플랫의 공식 캐릭터"
          TitleLogo={<Logo className="w-4.5 h-4.5" />}
          moreLink="official"
        />
      </section> */}
    </div>
  );
};

export default HomeTabContents;
