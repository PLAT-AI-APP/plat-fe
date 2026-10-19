"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn, formatWithCommas } from "@/lib/utils";
import { ArrowRight } from "@/icons";
import { QueryStateBoundary } from "@/components/state";
import { useEarningUniversesQuery } from "@/api/earning/getEarningUniverses";
import CharacterThumb from "./CharacterThumb";

/** 수익 탭에는 누적 상위 몇 개만 두고, 나머지는 전체 목록에서 쪽을 넘겨 본다. */
const TOP_COUNT = 5;

const ListSkeleton = () => (
  <div className="h-60 animate-pulse rounded-3xl border border-main bg-darker" />
);

/** 캐릭터별 수익. 누적이 많은 순으로 상위 5개와 전체 목록 링크. */
const CharacterEarnings = () => {
  const t = useTranslations("earnings");
  const { data, isPending, isError, error, refetch } = useEarningUniversesQuery(
    { sort: "TOTAL", direction: "DESC", keyword: "", page: 0, size: TOP_COUNT },
  );
  const rows = data?.content ?? [];
  const totalCount = data?.page.totalElements ?? 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="title-3">{t("characters.title")}</h2>
      <QueryStateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        pendingFallback={<ListSkeleton />}
      >
        {rows.length === 0 ? (
          <p className="body-5 rounded-3xl border border-main bg-darker px-5 py-10 text-center text-font-2">
            {t("characters.empty")}
          </p>
        ) : (
          <div className="flex flex-col rounded-3xl border border-main bg-darker px-5">
            <ul className="flex flex-col divide-y divide-main">
              {rows.map((row) => (
                <li key={row.universeId}>
                  <Link
                    href={`/creator/characters/${row.universeId}`}
                    className="flex items-center gap-3 py-4"
                  >
                    <CharacterThumb label={row} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          "title-5 truncate",
                          !row.active && "text-font-2",
                        )}
                      >
                        {row.title ?? t("characters.deleted")}
                      </span>
                      <span className="body-7 text-font-2 tabular-nums">
                        {t("characters.paidChats", {
                          count: formatWithCommas(row.totalPaidTurns),
                        })}
                      </span>
                    </div>
                    <span className="title-4 shrink-0 tabular-nums">
                      {t("points", { value: formatWithCommas(row.total) })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {totalCount > TOP_COUNT && (
              <Link
                href="/creator/characters"
                className="body-5 flex items-center justify-center gap-1 border-t border-main py-3.5 text-font-2 transition-colors hover:text-font-1"
              >
                {t("characters.viewAll", {
                  count: formatWithCommas(totalCount),
                })}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </QueryStateBoundary>
    </section>
  );
};

export default CharacterEarnings;
