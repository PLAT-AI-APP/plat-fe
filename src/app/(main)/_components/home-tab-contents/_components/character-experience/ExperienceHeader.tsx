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
      <h2 className="heading-3">
        <span className="flex items-center gap-2 ">
          플랫의 공식 캐릭터 맛보기 <Logo className="w-4.5 h-4.5" />
        </span>
      </h2>
      <div className="inline-flex justify-start items-center gap-4">
        {[1, 2, 3].map((_, i) => (
          <Image
            onClick={() => handleSelectedIndex(i)}
            key={i}
            alt=""
            width={48}
            height={48}
            className={`size-12.75 rounded-full cursor-pointer ${i === selectedIndex ? "border-[3px] border-brand" : "hover:opacity-70 active:scale-90"}`}
            src="/images/sample.png"
          />
        ))}
      </div>
    </header>
  );
};

export default ExperienceHeader;
