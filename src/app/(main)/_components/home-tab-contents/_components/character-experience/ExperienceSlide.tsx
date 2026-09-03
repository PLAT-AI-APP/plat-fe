import React from "react";
import type { OfficialPreviewItem } from "@/api/home/getOfficialPreview";
import CharacterProfileCard from "./CharacterProfileCard";
import ChatPreview from "./ChatPreview";

interface ExperienceSlideProps {
  item: OfficialPreviewItem;
  priority?: boolean;
}

/**
 * 슬라이드 전환 효과는 캐러셀 쪽 embla-carousel-fade 플러그인이 담당한다
 * (ExperienceCarousel 참고).
 *
 * 좌우 분할은 고정 px 이 아니라 1fr : 2fr 비율이다. 한쪽만 고정폭이면 창을 줄일 때
 * 나머지 한쪽만 눌려 두 영역이 따로 노는 것처럼 보인다.
 */
const ExperienceSlide = ({ item, priority }: ExperienceSlideProps) => {
  return (
    <div className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden">
      <div className="grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <CharacterProfileCard item={item} priority={priority} />
        <ChatPreview item={item} />
      </div>
    </div>
  );
};

export default ExperienceSlide;
