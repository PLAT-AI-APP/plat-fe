import React from "react";
import CharacterProfileCard from "./CharacterProfileCard";
import ChatPreview from "./ChatPreview";
import { OfficialPreviewItem } from "@/api/home/getOfficialPreview";

interface ExperienceSlideProps {
  item: OfficialPreviewItem;
}

/**
 * 슬라이드 전환 효과는 캐러셀 쪽 embla-carousel-fade 플러그인이 담당한다
 * (ExperienceCarousel 참고). 예전에는 여기서도 framer-motion 으로 1초짜리
 * 페이드와 blur(20px) 를 한 번 더 걸어 두 개의 페이드가 겹쳐 있었고,
 * 부모에 AnimatePresence 가 없어 exit 는 애초에 재생되지 않았다.
 */
const ExperienceSlide = ({ item }: ExperienceSlideProps) => {
  return (
    <div className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        <CharacterProfileCard item={item} />
        <ChatPreview item={item} />
      </div>
    </div>
  );
};

export default ExperienceSlide;
