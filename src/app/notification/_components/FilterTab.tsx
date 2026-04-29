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
  currentFilter: string;
}
const FilterTab = ({ currentFilter }: FilterTabProps) => {
  {
    /* 실시간, 일간, 주간, 월간 기준 sort tab */
  }
  return (
    <nav>
      <ul className="flex gap-2">
        {FilterTabArray.map(({ id, name }) => {
          const isActive = currentFilter === id;
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
                  query: {
                    filter: id,
                  },
                }}
                className={cn("text-sm text-font-2", isActive && "text-font-1")}
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
