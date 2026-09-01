"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown } from "@/icons";
import { cn } from "@/lib/utils";

/** 접힌 상태에서 보여줄 높이(px). 본문 네 줄 남짓. */
const COLLAPSED_HEIGHT = 88;

interface ExpandableDescriptionProps {
  content: string;
}

export const ExpandableDescription = ({
  content,
}: ExpandableDescriptionProps) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  // 펼침 높이를 실측해 둔다. max-height 를 88px ↔ auto 로 두면 auto 는 보간이
  // 되지 않아 펼칠 때만 툭 튀고 접을 때만 애니메이션되는 비대칭이 생긴다.
  const [contentHeight, setContentHeight] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const actualHeight = entries[0].target.scrollHeight;
      requestAnimationFrame(() => setContentHeight(actualHeight));
    });

    observer.observe(textRef.current);
    return () => observer.disconnect();
  }, [content]);

  const shouldShowExpand = contentHeight > COLLAPSED_HEIGHT;

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
          style={{
            maxHeight:
              shouldShowExpand && !isExpanded
                ? COLLAPSED_HEIGHT
                : contentHeight || undefined,
          }}
          className="body-4 overflow-hidden whitespace-pre-wrap text-font-2 transition-[max-height] duration-300"
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
