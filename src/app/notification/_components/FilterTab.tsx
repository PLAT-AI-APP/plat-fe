import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const FilterTabArray = [
  {
    id: "ALL",
    name: "전체",
  },
  { id: "NOTICE", name: "공지" },
  { id: "UPDATE", name: "업데이트" },
  { id: "EVENT", name: "이벤트" },
];

interface FilterTabProps {
  currentFilter: "NOTICE" | "UPDATE" | "EVENT" | null | undefined;
}
const FilterTab = ({ currentFilter }: FilterTabProps) => {
  return (
    <nav>
      <ul className="flex gap-2">
        {FilterTabArray.map(({ id, name }) => {
          // 1. currentFilter가 id와 정확히 일치하거나,
          const isActive =
            currentFilter === id || (id === "ALL" && !currentFilter);

          return (
            <li
              key={id}
              className={cn(
                "cursor-pointer py-1.5 px-3 rounded-[100px] bg-card hover:bg-card-hover",
                isActive && "bg-card-selected",
              )}
            >
              <Link
                href={{
                  // "전체"를 클릭했을 때는 쿼리 파라미터를 비워두는 것이 깔끔합니다.
                  query: id === "ALL" ? { filter: id } : { filter: id },
                }}
                className={cn(
                  "text-sm text-font-2 transition-colors",
                  isActive && "text-font-1 font-bold", // 가독성을 위해 font-bold 추가 권장
                )}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default FilterTab;
