"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "@/icons";
import { cn } from "@/lib/utils";

interface ExpandableDescriptionProps {
  content: string;
}

export const ExpandableDescription = ({
  content,
}: ExpandableDescriptionProps) => {
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
      <h3 className="text-font-1 title-3">
        캐릭터 정보 | <span className="title-5">이윤아</span>
      </h3>
      <div
        id="description-body"
        className={cn(
          "relative",
          shouldShowExpand &&
            !isExpanded &&
            "after:absolute after:bottom-0 after:left-0 after:w-full after:h-full after:bg-linear-to-t after:from-bg-dark after:to-transparent after:pointer-events-none",
        )}
      >
        <p
          ref={textRef}
          className={cn(
            "whitespace-pre-wrap body-4 text-font-2 leading-relaxed overflow-hidden transition-all duration-500",
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
          className="flex justify-center items-center gap-1 p-1 pl-2 body-6 text-font-2 hover:text-white transition-colors z-10"
        >
          {isExpanded ? "접기" : "펼치기"}
          <ArrowDown
            className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      )}
    </section>
  );
};

export default ExpandableDescription;
