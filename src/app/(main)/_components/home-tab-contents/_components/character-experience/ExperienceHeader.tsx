"use client";

import Logo from "@/icons/Logo";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";
import { OfficialPreviewItem } from "@/api/home/getOfficialPreview";

interface ExperienceHeaderProps {
  items: OfficialPreviewItem[];
  handleSelectedIndex: (index: number) => void;
  selectedIndex: number;
}
const ExperienceHeader = ({
  items,
  handleSelectedIndex,
  selectedIndex,
}: ExperienceHeaderProps) => {
  const t = useTranslations("home");

  return (
    <header className="flex justify-between">
      <h2 className="title-2">
        <span className="flex items-center gap-2">
          {t("officialShowcase")} <Logo className="w-4.5 h-4.5" />
        </span>
      </h2>
      <div className="inline-flex justify-start items-center gap-3">
        {items.slice(0, 3).map((item, i) => (
          <Image
            onClick={() => handleSelectedIndex(i)}
            key={item.universeId}
            alt={item.title}
            width={44}
            height={44}
            className={`size-11 rounded-full cursor-pointer object-cover ${i === selectedIndex ? "border-4 border-brand" : "opacity-74 active:scale-90"}`}
            src={item.images[0]}
          />
        ))}
      </div>
    </header>
  );
};

export default ExperienceHeader;
