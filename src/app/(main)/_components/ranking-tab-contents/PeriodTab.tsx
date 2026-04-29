"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import dayjs from "@/lib/dayjs";

const PeriodTabArray = [
  {
    id: "live",
    name: "실시간",
  },
  { id: "daily", name: "일간", sortTime: "매일 12시 집계" },
  { id: "weekly", name: "주간", sortTime: "매주 월요일 집계" },
  { id: "monthly", name: "월간", sortTime: "매달 1일 집계" },
];

const PeriodTab = () => {
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "live";

  const currentSortTime = useMemo(() => {
    if (currentPeriod === "live") {
      return `${dayjs().format("MM-DD HH:mm")} 기준`;
    }
    return PeriodTabArray.find((v) => v.id === currentPeriod)?.sortTime || "";
  }, [currentPeriod]);

  return (
    <header className="flex items-center justify-between">
      {/* 실시간, 일간, 주간, 월갑 기준 sort tab */}
      <nav>
        <ul className="flex gap-2">
          {PeriodTabArray.map(({ id, name }) => {
            const isActive = currentPeriod === id;
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
                      tab: "ranking",
                      period: id,
                    },
                  }}
                  className={cn(
                    "text-sm text-font-2",
                    isActive && "text-font-1",
                  )}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 상세 날짜 기준 */}
      <span className="text-xs text-font-disabled">{currentSortTime}</span>
    </header>
  );
};

export default PeriodTab;
