"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LastImageActionOverlayProps {
  isVisible: boolean;
}

const LastImageActionOverlay = ({ isVisible }: LastImageActionOverlayProps) => {
  const t = useTranslations("characterCard");

  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 bg-[#0D0E11]/80 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-27.25 z-10 flex -translate-x-1/2 flex-col items-center gap-3 transition-all duration-500 ease-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        )}
      >
        <p className="title-3 text-white text-nowrap">
          {t("otherLooksPrompt")}
        </p>

        <button
          type="button"
          className="hover:bg-brand/20 pointer-events-auto rounded-xl border border-brand-dark bg-[#0D0E11]/40 px-4 py-2 title-4 text-brand"
        >
          {t("viewProfile")}
        </button>
      </div>
    </>
  );
};

export default LastImageActionOverlay;
