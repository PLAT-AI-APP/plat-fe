import { Search } from "@/icons";
import { cn } from "@/lib/utils";
import React from "react";

// 데이터 (상단 배치)
const EXPLORE_TAGS = [
  { name: "학교생활", outline: "outline-brand", isHot: true },
  { name: "로맨스", outline: "outline-border", isHot: true },
  { name: "판타지", outline: "outline-border", isHot: true },
  { name: "일상", outline: "outline-font-bg-font-disableds", isHot: true },
  { name: "액션", outline: "outline-border", isHot: false },
  { name: "미스터리", outline: "outline-border", isHot: false },
  { name: "SF", outline: "outline-border", isHot: false },
  { name: "힐링", outline: "outline-border", isHot: false },
  { name: "개그", outline: "outline-border", isHot: false },
  { name: "공포", outline: "outline-border", isHot: false },
  { name: "BL", outline: "outline-border", isHot: false },
  { name: "GL", outline: "outline-border", isHot: false },
  { name: "고교생", outline: "outline-border", isHot: false },
  { name: "대학생", outline: "outline-border", isHot: false },
  { name: "직장인", outline: "outline-border", isHot: false },
  { name: "연상", outline: "outline-border", isHot: false },
  { name: "연하", outline: "outline-border", isHot: false },
  { name: "츤데레", outline: "outline-border", isHot: false },
  { name: "얀데레", outline: "outline-border", isHot: false },
  { name: "활발", outline: "outline-border", isHot: false },
  { name: "조용함", outline: "outline-border", isHot: false },
  { name: "지적인", outline: "outline-border", isHot: false },
  { name: "귀여움", outline: "outline-border", isHot: false },
  { name: "카리스마", outline: "outline-border", isHot: false },
  { name: "장난스러움", outline: "outline-border", isHot: false },
  { name: "소꿉친구", outline: "outline-border", isHot: false },
  { name: "선생님", outline: "outline-border", isHot: false },
  { name: "선배", outline: "outline-border", isHot: false },
  { name: "후배", outline: "outline-border", isHot: false },
  { name: "존예", outline: "outline-border", isHot: false },
  { name: "학교", outline: "outline-border", isHot: false },
  { name: "일상", outline: "outline-border", isHot: false },
  { name: "보컬", outline: "outline-border", isHot: false },
  { name: "동양", outline: "outline-border", isHot: false },
  { name: "다정", outline: "outline-border", isHot: false },
  { name: "능글", outline: "outline-border", isHot: false },
];

interface ResearchProps {
  currentTag?: string;
}
const Research = ({ currentTag = "학교생활" }: ResearchProps) => {
  return (
    <section className="self-stretch flex flex-col items-start gap-4">
      <header className="inline-flex items-center gap-3">
        <div className="size-8 bg-card rounded-lg flex justify-center items-center gap-2.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6667 1.66699H3.33333C2.875 1.66699 2.5 2.04199 2.5 2.50033V4.16699C2.5 4.35033 2.55833 4.52533 2.66667 4.66699L7.5 11.1087V17.5003C7.5 17.7213 7.5878 17.9333 7.74408 18.0896C7.90036 18.2459 8.11232 18.3337 8.33333 18.3337C8.45833 18.3337 8.59167 18.3003 8.70833 18.242L12.0417 16.5753C12.1791 16.5061 12.2947 16.4001 12.3756 16.2692C12.4565 16.1383 12.4995 15.9875 12.5 15.8337V11.1087L17.3333 4.66699C17.4417 4.52533 17.5 4.35033 17.5 4.16699V2.50033C17.5 2.04199 17.125 1.66699 16.6667 1.66699ZM15.8333 3.89199L11 10.3337C10.8917 10.4753 10.8333 10.6503 10.8333 10.8337V15.317L9.16667 16.1503V10.8337C9.16667 10.6503 9.10833 10.4753 9 10.3337L4.16667 3.89199V3.33366H15.8333V3.89199Z"
              fill="#ECEDF5"
            />
          </svg>
        </div>
        <h2>탐색 태그</h2>
      </header>

      <div className="max-w-full flex flex-col items-start gap-6">
        <div className="relative w-full">
          <input
            placeholder="어떤 캐릭터를 찾고 있나요?"
            className={cn(
              "peer",
              "w-full",
              "px-3 py-2.5 bg-card rounded-xl border border-border-main",
              "pl-8 focus:pl-3",
              "placeholder:text-font-disabled outline-none",
              "transition-all duration-200",
            )}
          />

          <Search className="size-4.5 text-font-disabled absolute top-1/2 -translate-y-1/2 left-3 peer-focus:hidden" />
        </div>

        <div
          id="explore-tag-list"
          className="self-stretch inline-flex items-center gap-2 flex-wrap content-center"
        >
          {EXPLORE_TAGS.map((tag, index) => (
            <span
              key={index}
              className={cn(
                `cursor-pointer px-1.5 py-1 rounded-md border border-border-main hover:border-font-disabled flex justify-center items-center ${tag.outline} ${tag.isHot ? "gap-1" : "gap-0.5"}`,
                currentTag === tag.name && "border-brand text-brand",
              )}
            >
              <span className="flex items-center gap-0.5">
                <span>#</span>
                <span>{tag.name}</span>
              </span>
              {tag.isHot && <span className="text-font-accents">HOT</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Research;
