"use client";

import { ArrowDown, Close } from "@/icons";
import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";

interface TagPillProps {
  label: string;
  isSelected?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  onRemove?: () => void;
}

export const TagPill = ({
  label,
  isSelected = false,
  size = "md",
  onClick,
  onRemove,
}: TagPillProps) => {
  const isInteractive = !!onClick || !!onRemove;

  // 클릭 가능한 태그와 단순 표시용 태그가 같은 스타일을 쓰도록 공통 className을 먼저 조립합니다.
  const className = cn(
    "inline-flex shrink-0 items-center justify-center rounded-md border font-medium transition-colors",
    "border-transparent bg-card text-font-2",
    "group-hover:text-brand-dark",
    isInteractive && "hover:text-font-1",
    isSelected && "border-brand bg-brand-opacity text-brand",
    size === "sm" && "h-5 body-5 bg-transparent",
    size === "md" && "h-[29px] px-2 py-1 body-4",
    size === "lg" && "h-[33px] pl-3 py-1.5 pr-2 title-5 border-none",
    isInteractive ? "cursor-pointer" : "cursor-default",
  );

  // 추천 카드 안의 작은 태그처럼 동작이 없는 경우에는 button 대신 span으로 렌더링합니다.
  // 이렇게 하면 disabled button의 브라우저 기본 스타일이 섞이지 않습니다.
  const content = (
    <>
      <span className="flex items-center gap-0.5 whitespace-nowrap">
        <span>#</span>
        <span>{label}</span>
      </span>
      {onRemove && <Close className="size-3 ml-1 text-font-2" />}
    </>
  );

  if (!isInteractive) {
    return <span className={className}>{content}</span>;
  }

  return (
    <button type="button" onClick={onRemove || onClick} className={className}>
      {content}
    </button>
  );
};

interface TagFolderProps {
  title: string;
  tags?: string[];
  selectedTags?: string[];
  children?: React.ReactNode;
  titleSuffix?: React.ReactNode;
  onTagToggle?: (tag: string) => void;
}

export const TagFolder = ({
  title,
  tags,
  selectedTags = [],
  children,
  titleSuffix,
  onTagToggle,
}: TagFolderProps) => {
  // 각 폴더는 독립적으로 열림/닫힘 상태를 가집니다.
  const [isOpen, setIsOpen] = useState(true);

  const selectedTagCount = useMemo(() => {
    if (!tags) return 0;

    // 접힌 상태의 카운트는 전체 선택 개수가 아니라 이 폴더에 속한 선택 태그 개수만 보여줍니다.
    return tags.filter((tag) => selectedTags.includes(tag)).length;
  }, [selectedTags, tags]);

  const orderedTags = useMemo(() => {
    if (!tags) return [];

    // 원본 tags 배열은 유지하고, 화면에 보여줄 때만 선택된 태그를 앞으로 보냅니다.
    // 선택을 해제하면 selectedTags에서 빠져 다시 원래 tags 순서의 자리로 돌아갑니다.
    const selected = tags.filter((tag) => selectedTags.includes(tag));
    const unselected = tags.filter((tag) => !selectedTags.includes(tag));

    return [...selected, ...unselected];
  }, [selectedTags, tags]);

  return (
    <section className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[21px] w-full items-center justify-between text-left"
      >
        <span className="body-4 flex items-center gap-1.5 text-font-2">
          {title}
          {titleSuffix}
          {!isOpen && selectedTagCount > 0 && (
            <span className="text-brand-dark">+{selectedTagCount}</span>
          )}
        </span>
        <ArrowDown
          className={cn(
            "size-4 text-font-2 transition-transform duration-300 ease-out",
            !isOpen && "-rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          // grid-template-rows를 1fr/0fr로 전환해 내용 높이를 몰라도 부드럽게 접고 펼칩니다.
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-3">
            {children}

            {tags && (
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {orderedTags.map((tag) => (
                  <TagPill
                    key={tag}
                    label={tag}
                    isSelected={selectedTags.includes(tag)}
                    onClick={() => onTagToggle?.(tag)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
