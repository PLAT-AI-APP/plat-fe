"use client";

import Logo from "@/icons/Logo";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";
import type { OfficialPreviewItem } from "@/api/home/getOfficialPreview";
import { cn } from "@/lib/utils";

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
    <header className="flex items-end justify-between gap-4">
      <h2 className="title-1 flex items-center gap-2 text-font-0">
        {t("officialShowcase")} <Logo className="h-4.5 w-4.5" />
      </h2>

      {items.length > 1 && (
        <div className="inline-flex items-center justify-start gap-3">
          {items.map((item, index) => (
            <button
              key={item.universeId}
              type="button"
              onClick={() => handleSelectedIndex(index)}
              aria-label={item.title}
              aria-current={index === selectedIndex}
              className={cn(
                "size-11 overflow-hidden rounded-full transition",
                index === selectedIndex
                  ? "border-2 border-brand"
                  : "opacity-70 hover:opacity-100 active:scale-90",
              )}
            >
              {item.images?.[0] && (
                <Image
                  alt=""
                  width={44}
                  height={44}
                  sizes="44px"
                  className="size-full object-cover"
                  src={item.images[0]}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default ExperienceHeader;
