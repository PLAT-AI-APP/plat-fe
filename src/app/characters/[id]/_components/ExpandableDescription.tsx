"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown } from "@/icons";
import { cn } from "@/lib/utils";

interface ExpandableDescriptionProps {
  content: string;
}

export const ExpandableDescription = ({
  content,
}: ExpandableDescriptionProps) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowExpand, setShouldShowExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const actualHeight = entries[0].target.scrollHeight;
      requestAnimationFrame(() => {
        setShouldShowExpand(actualHeight > 88);
      });
    });

    observer.observe(textRef.current);
    return () => observer.disconnect();
  }, [content]);

  return (
    <section className="flex flex-col gap-3">
      <h3 className="title-3 text-font-1">
        {t("characterDetail.infoTitle")} | <span className="title-5">이윤아</span>
      </h3>
      <div
        id="description-body"
        className={cn(
          "relative",
          shouldShowExpand &&
            !isExpanded &&
            "after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-full after:w-full after:bg-linear-to-t after:from-dark after:to-transparent",
        )}
      >
        <p
          ref={textRef}
          className={cn(
            "body-4 overflow-hidden whitespace-pre-wrap text-font-2 leading-relaxed transition-all duration-500",
            shouldShowExpand && !isExpanded ? "max-h-22" : "",
          )}
        >
          {content}
        </p>
      </div>

      {shouldShowExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="body-6 z-10 flex items-center justify-center gap-1 p-1 pl-2 text-font-2 transition-colors hover:text-font-1"
        >
          {isExpanded ? t("characterDetail.collapse") : t("characterDetail.expand")}
          <ArrowDown
            className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
          />
        </button>
      )}
    </section>
  );
};

export default ExpandableDescription;
