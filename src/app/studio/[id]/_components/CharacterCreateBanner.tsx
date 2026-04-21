import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CharacterCreateBanner = () => {
  return (
    <div
      className={cn(
        "flex justify-between rounded-3xl border border-border-main bg-bg-darker py-4 px-5",
        "@max-[400px]:flex-col @max-[400px]:gap-6",
      )}
    >
      <div className="flex flex-col gap-1 font-medium">
        <span>캐릭터 제작</span>
        <span className="text-xs text-font-2">
          나만의 캐릭터를 직접 만들고 공유해 보세요
        </span>
      </div>
      <Link
        href={`/character-creat`}
        className={cn(
          "flex items-center h-10 text-sm text-brand font-medium py-2.5 pr-5 pl-4 rounded-xl bg-brand-opacity border border-brand",
          "justify-center",
        )}
      >
        제작하기
      </Link>
    </div>
  );
};

export default CharacterCreateBanner;
