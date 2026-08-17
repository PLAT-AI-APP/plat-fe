"use client";

import New from "@/icons/New";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterShowcase from "../CharacterShowcase";
import CharacterExperience from "./_components/character-experience";
import CharacterCreateBanner from "../CharacterCreateBanner";

interface HomeTabContentsProps {
  charArray: {
    name: string;
    chatCount: number;
    dec: string;
    tag?: string[];
    img: string[] | string;
    isNew?: boolean;
    isOfficial?: boolean;
  }[];
}
const HomeTabContents = ({ charArray }: HomeTabContentsProps) => {
  // 홈 탭 언어는 설정 변경 직후 바로 반영되어야 하므로 클라이언트 번역 컨텍스트를 사용합니다.
  const t = useTranslations("home");

  return (
    <article className="flex flex-col gap-18 mt-7">
      {/* 오늘의 PICK 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title={t("todayPick")}
        allViewLink=""
        cardSize="S"
        columnGap={16}
        layout="carousel"
      />

      {/* 플랫의 공식 캐릭터 맛보기 섹션 */}
      <CharacterExperience />

      {/* 인기 태그 캐릭터 모음 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title={t("popularTagCollection")}
        cardSize="S"
        limit={12}
        columnGap={16}
        rowGap={28}
      />

      {/* 인기 캐릭터 이미지 미리보기 섹션 */}
      <CharacterShowcase
        charArray={[
          {
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=1",
              "https://picsum.photos/200/300?random=2",
              "https://picsum.photos/200/300?random=3",
            ],
          },
          {
            // (참고) id가 겹치면 리스트 렌더링 시 key 에러가 날 수 있어 임의로 변경했습니다.
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=4",
              "https://picsum.photos/200/300?random=5",
              "https://picsum.photos/200/300?random=6",
            ],
          },
          {
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=7",
              "https://picsum.photos/200/300?random=8",
              "https://picsum.photos/200/300?random=9",
            ],
          },
          {
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=10",
              "https://picsum.photos/200/300?random=11",
              "https://picsum.photos/200/300?random=12",
            ],
          },
          {
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=13",
              "https://picsum.photos/200/300?random=14",
              "https://picsum.photos/200/300?random=15",
            ],
          },
          {
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=16",
              "https://picsum.photos/200/300?random=17",
              "https://picsum.photos/200/300?random=18",
            ],
          },
          {
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=19",
              "https://picsum.photos/200/300?random=20",
              "https://picsum.photos/200/300?random=21",
            ],
          },
          {
            name: "옆자리 불량학생",
            chatCount: 123,
            dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
            img: [
              "https://picsum.photos/200/300?random=22",
              "https://picsum.photos/200/300?random=23",
              "https://picsum.photos/200/300?random=24",
            ],
          },
        ]}
        title={t("popularCharacterPreview")}
        cardSize="L"
        limit={3}
      />

      {/* 최근 소문나기 시작한 신작 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title={t("recentNewCharacters")}
        allViewLink="new"
        cardSize="M"
        limit={10}
        TitleLogo={<New className="w-4.5 h-4.5" />}
        columnGap={16}
        rowGap={28}
      />

      {/* (유저이름)님을 위한 추천 섹션 */}
      <CharacterShowcase
        charArray={charArray}
        title={t("recommendationForYou")}
        allViewLink="asf"
        cardSize="S"
        limit={24}
        columnGap={16}
        rowGap={28}
      />

      <CharacterCreateBanner />
    </article>
  );
};

export default HomeTabContents;
