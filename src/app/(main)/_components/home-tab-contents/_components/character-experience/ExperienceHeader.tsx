import Logo from "@/icons/Logo";
import Image from "next/image";
import React from "react";

const ExperienceHeader = () => {
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
            key={i}
            alt=""
            width={48}
            height={48}
            className={`size-12 rounded-full ${i === 0 ? "border-[3px] border-brand" : ""}`}
            src="/images/sample.png"
          />
        ))}
      </div>
    </header>
  );
};

export default ExperienceHeader;
