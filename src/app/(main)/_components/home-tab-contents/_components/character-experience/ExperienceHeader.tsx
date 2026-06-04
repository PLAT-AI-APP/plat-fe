import Logo from "@/icons/Logo";
import Image from "next/image";
import React from "react";

interface ExperienceHeaderProps {
  handleSelectedIndex: (index: number) => void;
  selectedIndex: number;
}
const ExperienceHeader = ({
  handleSelectedIndex,
  selectedIndex,
}: ExperienceHeaderProps) => {
  return (
    <header className="flex justify-between">
      <h2 className="title-2">
        <span className="flex items-center gap-2">
          플랫의 공식 캐릭터 맛보기 <Logo className="w-4.5 h-4.5" />
        </span>
      </h2>
      <div className="inline-flex justify-start items-center gap-3">
        {[1, 2, 3].map((_, i) => (
          <Image
            onClick={() => handleSelectedIndex(i)}
            key={i}
            alt=""
            width={44}
            height={44}
            className={`size-11 rounded-full cursor-pointer ${i === selectedIndex ? "border-4 border-brand" : "opacity-74 active:scale-90"}`}
            src={`https://picsum.photos/seed/experience-thumb-${i}/200/300`}
          />
        ))}
      </div>
    </header>
  );
};

export default ExperienceHeader;
