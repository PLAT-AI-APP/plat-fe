import React from "react";
import { motion } from "framer-motion";
import CharacterProfileCard from "./CharacterProfileCard";
import ChatPreview from "./ChatPreview";

interface ExperienceSlideProps {
  index: number;
}

const ExperienceSlide = ({ index }: ExperienceSlideProps) => {
  return (
    <div className="flex min-w-full h-full relative">
      <motion.div
        className="flex w-full h-full"
        // 화면에 안 보일 때: 투명하고 살짝 블러 처리
        initial={{ opacity: 0, filter: "blur(20px)" }}
        // 슬라이드가 화면에 나타날 때 (Embla가 넘겨줄 때 자동 실행)
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        // 화면에서 벗어날 때
        exit={{ opacity: 0, filter: "blur(20px)" }}
        // 애니메이션 설정 (0.6초 동안 부드럽게)
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <CharacterProfileCard index={index} />
        <ChatPreview />
      </motion.div>
    </div>
  );
};

export default ExperienceSlide;
