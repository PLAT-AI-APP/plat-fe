"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Search } from "@/icons";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import { cn, formatWithCommas } from "@/lib/utils";
import { useEarningUniversesQuery } from "@/api/earning/getEarningUniverses";
import type { EarningUniverseRow, UniverseEarningSort } from "@/type/earning";
import CharacterThumb from "../_components/CharacterThumb";
import ClearInputButton from "@/components/ui/ClearInputButton";

/** 서버가 정렬 기준대로 한 쪽에 20개씩 준다. */
const PAGE_SIZE = 20;

const COLUMNS: Array<{
  key: UniverseEarningSort;
  value: (row: EarningUniverseRow) => number;
}> = [
  { key: "YESTERDAY", value: (row) => row.yesterday },
  { key: "WEEK", value: (row) => row.week },
  { key: "MONTH", value: (row) => row.month },
  { key: "TOTAL", value: (row) => row.total },
];

/** 넓은 화면은 한 줄(이름 | 지표 4칸), 좁은 화면은 이름 아래 지표 4칸을 같은 열에 맞춘다. */
const ROW_GRID =
  "grid grid-cols-4 gap-x-2 sm:grid-cols-[minmax(0,1fr)_repeat(4,5.5rem)] sm:items-center";

/** 현재 쪽 앞뒤로 두 쪽씩, 처음·끝은 늘 보이고 사이가 비면 … 로 줄인다. */
const pageItems = (page: number, total: number): Array<number | "gap"> => {
  const items: Array<number | "gap"> = [];
  for (let p = 1; p <= total; p += 1) {
    if (p === 1 || p === total || Math.abs(p - page) <= 2) {
      items.push(p);
    } else if (items[items.length - 1] !== "gap") {
      items.push("gap");
    }
  }
  return items;
};

const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  const t = useTranslations("earnings.characters");
  return (
    <nav
      aria-label={t("pagination")}
      className="flex items-center justify-center gap-1"
    >
      <button
        type="button"
        aria-label={t("prevPage")}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex size-8 items-center justify-center rounded-lg text-font-2 transition-colors enabled:hover:text-font-1 disabled:opacity-30"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
      </button>
      {pageItems(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span
            key={`gap-${index}`}
            className="body-6 w-6 text-center text-font-disabled"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={cn(
              "body-6 min-w-8 rounded-lg px-1.5 py-1.5 tabular-nums transition-colors",
              item === page
                ? "bg-font-1/[0.08] text-font-1"
                : "text-font-2 hover:text-font-1",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label={t("nextPage")}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="flex size-8 items-center justify-center rounded-lg text-font-2 transition-colors enabled:hover:text-font-1 disabled:opacity-30"
      >
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </button>
    </nav>
  );
};

const TableSkeleton = () => (
  <div className="h-96 animate-pulse rounded-3xl border border-main bg-darker" />
);

const SortArrow = ({ desc }: { desc: boolean }) => (
  <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
    <path
      d={desc ? "M3 4.5 6 7.5l3-3" : "M3 7.5 6 4.5l3 3"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 캐릭터별 수익 추적. 캐릭터마다 어제·최근 7일·최근 30일·누적을 나란히 두고,
 * 열 제목을 눌러 정렬한다(한 번 더 누르면 반대로). 줄을 누르면 그 캐릭터의 일별 수익으로 간다.
 */
const CharacterEarningList = () => {
  const t = useTranslations("earnings");
  const [sortKey, setSortKey] = useState<UniverseEarningSort>("TOTAL");
  const [desc, setDesc] = useState(true);
  // 입력 중에는 찾지 않고, 엔터 · 검색 버튼을 눌렀을 때만 서버에 묻는다.
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError, error, refetch } = useEarningUniversesQuery(
    {
      sort: sortKey,
      direction: desc ? "DESC" : "ASC",
      keyword: query,
      page: page - 1,
      size: PAGE_SIZE,
    },
  );
  const rows = data?.content ?? [];
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);

  const goPage = (next: number) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ block: "start" });
  };

  const search = (value: string) => {
    setQuery(value.trim());
    setPage(1);
  };

  const sortBy = (key: UniverseEarningSort) => {
    if (key === sortKey) {
      setDesc((prev) => !prev);
    } else {
      setSortKey(key);
      setDesc(true);
    }
    setPage(1);
  };

  return (
    <section className="flex flex-col gap-6">
      <Link
        href="/creator"
        className="body-5 flex w-fit items-center gap-1.5 text-font-2 transition-colors hover:text-font-1"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("center.title")}
      </Link>

      <h1 className="heading-2">
        {t("characters.title")}
        {/* 검색 중에는 찾은 수라 전체 캐릭터 수로 읽히지 않게 숨긴다. */}
        {data && !query && (
          <span className="title-3 ml-2 text-font-2 tabular-nums">
            {formatWithCommas(data.page.totalElements)}
          </span>
        )}
      </h1>

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          search(keyword);
        }}
        className="flex h-11 items-center gap-2 rounded-2xl border border-main bg-darker pr-1.5 pl-4 transition-colors focus-within:border-font-2"
      >
        <Search
          className="size-4.5 shrink-0 text-font-disabled"
          aria-hidden="true"
        />
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={t("characters.searchPlaceholder")}
          className="focus-ring-none body-5 min-w-0 flex-1 appearance-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled [&::-webkit-search-cancel-button]:appearance-none"
        />
        {keyword && (
          <>
            <ClearInputButton
              label={t("characters.clearSearch")}
              onClear={() => {
                setKeyword("");
                if (query) search("");
              }}
            />
            <Button type="submit" size="sm">
              {t("characters.search")}
            </Button>
          </>
        )}
      </form>

      <QueryStateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        pendingFallback={<TableSkeleton />}
      >
        <div
          ref={listTopRef}
          className="flex scroll-mt-[calc(var(--header-height)+16px)] flex-col rounded-3xl border border-main bg-darker px-5"
        >
          <div
            className={cn(
              ROW_GRID,
              "sticky top-(--header-height) z-[1] border-b border-main bg-darker py-3",
            )}
          >
            <span className="body-7 hidden text-font-2 sm:block">
              {t("characters.column.character")}
            </span>
            {COLUMNS.map((column) => {
              const isActive = sortKey === column.key;
              return (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => sortBy(column.key)}
                  aria-pressed={isActive}
                  className={cn(
                    "body-7 flex items-center justify-end gap-0.5 transition-colors",
                    isActive ? "text-font-1" : "text-font-2 hover:text-font-1",
                  )}
                >
                  {t(`characters.column.${column.key}`)}
                  {isActive && <SortArrow desc={desc} />}
                </button>
              );
            })}
          </div>

          {rows.length === 0 ? (
            <p className="body-5 py-10 text-center text-font-2">
              {query ? t("characters.noResult") : t("characters.empty")}
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-main">
              {rows.map((row) => (
                <li key={row.universeId}>
                  <Link
                    href={`/creator/characters/${row.universeId}`}
                    className={cn(ROW_GRID, "gap-y-2 py-3.5")}
                  >
                    <span className="col-span-4 flex min-w-0 items-center gap-3 sm:col-span-1">
                      <CharacterThumb label={row} size={36} />
                      <span
                        className={cn(
                          "title-5 truncate",
                          !row.active && "text-font-2",
                        )}
                      >
                        {row.title ?? t("characters.deleted")}
                      </span>
                    </span>
                    {COLUMNS.map((column) => (
                      <span
                        key={column.key}
                        className={cn(
                          "body-5 text-right tabular-nums",
                          sortKey === column.key
                            ? "title-5 text-font-1"
                            : "text-font-2",
                        )}
                      >
                        {formatWithCommas(column.value(row))}
                      </span>
                    ))}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </QueryStateBoundary>
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={goPage} />
      )}
    </section>
  );
};

export default CharacterEarningList;
