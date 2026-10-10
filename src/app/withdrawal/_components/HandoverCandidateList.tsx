"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import ResourceImage from "@/components/ResourceImage";
import { ArrowDown, Chat, Search } from "@/icons";
import { toImageVariantUrl } from "@/lib/file";
import { cn, formatWithCommas } from "@/lib/utils";
import type { WithdrawalCandidate, WithdrawalChoice } from "@/type/withdrawal";

/** 처음 보이는 줄 수와 "더 보기" 한 번에 늘어나는 줄 수. 수백 개여도 한 화면이 길어지지 않게 한다. */
const PAGE_SIZE = 10;
const MORE_SIZE = 50;
/** 이보다 많으면 이름 검색을 둔다. */
const SEARCH_THRESHOLD = 8;

type Filter = "ALL" | "UNDECIDED" | "KEEP" | "DELETE";

interface ChoiceSegmentProps {
  title: string;
  choice?: WithdrawalChoice;
  canKeep: boolean;
  onSelect: (choice: WithdrawalChoice) => void;
}

/** 한 줄의 남기기·삭제. 처음에는 아무것도 골라져 있지 않다(미리 고른 것으로 치면 안 된다). */
const ChoiceSegment = ({ title, choice, canKeep, onSelect }: ChoiceSegmentProps) => {
  const t = useTranslations("withdrawalPage.characters");
  const options: { value: WithdrawalChoice; label: string; disabled: boolean }[] = [
    { value: "KEEP", label: t("keep"), disabled: !canKeep },
    { value: "DELETE", label: t("delete"), disabled: false },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={title}
      className="flex shrink-0 rounded-xl border border-main bg-dark p-0.5"
    >
      {options.map((option) => {
        const isSelected = choice === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={option.disabled}
            onClick={() => onSelect(option.value)}
            className={cn(
              "title-7 h-8 min-w-14 rounded-[10px] px-3 transition-colors",
              isSelected
                ? option.value === "KEEP"
                  ? // 줄이 수십 개여도 주황이 목록을 덮지 않게, 남기기는 옅은 주황 바탕에 주황 글씨로 둔다.
                    "bg-brand-opacity-2 text-brand"
                  : "bg-btn-selected text-font-1"
                : "text-font-2 enabled:hover:text-font-1",
              option.disabled && "cursor-not-allowed text-font-disabled",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

interface HandoverCandidateListProps {
  candidates: WithdrawalCandidate[];
  canKeep: boolean;
  getChoice: (universeId: string) => WithdrawalChoice | undefined;
  onChange: (universeId: string, choice: WithdrawalChoice) => void;
  onChangeMany: (universeIds: string[], choice: WithdrawalChoice) => void;
}

/**
 * 대화 중인 다른 유저가 있는 캐릭터 목록. 수백 개여도 다룰 수 있게 한 줄씩 짧게 두고,
 * 접기 · 검색 · 상태 필터 · 일괄 선택 · 더 보기를 둔다. 대화가 많은 캐릭터부터 보인다.
 */
const HandoverCandidateList = ({
  candidates,
  canKeep,
  getChoice,
  onChange,
  onChangeMany,
}: HandoverCandidateListProps) => {
  const t = useTranslations("withdrawalPage.characters");
  const [isOpen, setIsOpen] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  // 필터를 건 채로 고르면 그 줄이 바로 사라져 손 밑에서 목록이 움직인다. 필터를 고른 순간의 목록을 붙잡아 둔다.
  const [filterSnapshot, setFilterSnapshot] = useState<Set<string> | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sorted = useMemo(
    () => [...candidates].sort((a, b) => b.otherRoomCount - a.otherRoomCount),
    [candidates],
  );

  const counts = {
    ALL: candidates.length,
    KEEP: candidates.filter((c) => getChoice(c.universeId) === "KEEP").length,
    DELETE: candidates.filter((c) => getChoice(c.universeId) === "DELETE").length,
    UNDECIDED: candidates.filter((c) => !getChoice(c.universeId)).length,
  };

  const normalizedKeyword = keyword.trim().toLowerCase();
  const matchesFilter = (candidate: WithdrawalCandidate, target: Filter) => {
    const choice = getChoice(candidate.universeId);
    if (target === "UNDECIDED") return !choice;
    if (target === "KEEP" || target === "DELETE") return choice === target;
    return true;
  };
  const filtered = sorted.filter((candidate) => {
    if (normalizedKeyword && !candidate.title.toLowerCase().includes(normalizedKeyword)) return false;
    return filterSnapshot ? filterSnapshot.has(candidate.universeId) : matchesFilter(candidate, filter);
  });
  const visible = filtered.slice(0, visibleCount);
  const hiddenCount = filtered.length - visible.length;
  const isNarrowed = Boolean(normalizedKeyword) || filter !== "ALL";

  const selectFilter = (next: Filter) => {
    setFilter(next);
    setVisibleCount(PAGE_SIZE);
    setFilterSnapshot(
      next === "ALL"
        ? null
        : new Set(candidates.filter((c) => matchesFilter(c, next)).map((c) => c.universeId)),
    );
  };

  const applyToFiltered = (choice: WithdrawalChoice) =>
    onChangeMany(
      filtered.map((candidate) => candidate.universeId),
      choice,
    );

  const filters: { value: Filter; label: string }[] = [
    { value: "ALL", label: t("filters.all") },
    { value: "UNDECIDED", label: t("filters.undecided") },
    { value: "KEEP", label: t("keep") },
    { value: "DELETE", label: t("delete") },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-main bg-darkest">
      {/* 머리를 누르면 목록 전체를 접는다. 접어도 몇 개를 어떻게 골랐는지는 보인다. */}
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-card/40"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="title-4 flex items-center gap-2 text-font-1">
            {t("listTitle")}
            <span className="body-8 rounded-full bg-card px-2 py-0.5 text-font-2 tabular-nums">
              {formatWithCommas(counts.ALL)}
            </span>
          </span>
          {/* 남길 수 없으면 모두 삭제라 남기기 · 미선택 수는 의미가 없다. */}
          {canKeep ? (
            <span className="body-7 flex flex-wrap items-center gap-x-2 text-font-2 tabular-nums">
              <span>{t("counts.keep", { count: formatWithCommas(counts.KEEP) })}</span>
              <span aria-hidden="true" className="text-font-disabled">·</span>
              <span>{t("counts.delete", { count: formatWithCommas(counts.DELETE) })}</span>
              <span aria-hidden="true" className="text-font-disabled">·</span>
              <span className={cn(counts.UNDECIDED > 0 ? "text-brand" : "text-font-2")}>
                {t("counts.undecided", { count: formatWithCommas(counts.UNDECIDED) })}
              </span>
            </span>
          ) : (
            <span className="body-7 text-font-2 tabular-nums">
              {t("counts.delete", { count: formatWithCommas(counts.DELETE) })}
            </span>
          )}
        </span>
        <ArrowDown
          size={16}
          aria-hidden="true"
          className={cn("shrink-0 text-font-2 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <>
          {(canKeep || candidates.length > SEARCH_THRESHOLD) && (
            <div className="flex flex-col gap-3 border-t border-main px-5 py-4">
              {candidates.length > SEARCH_THRESHOLD && (
                <label className="flex h-10 items-center gap-2 rounded-xl border border-main bg-dark px-3 focus-within:border-font-disabled">
                  <Search size={16} className="shrink-0 text-font-2" aria-hidden="true" />
                  <input
                    type="search"
                    value={keyword}
                    onChange={(event) => {
                      setKeyword(event.target.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    placeholder={t("searchPlaceholder")}
                    className="body-5 min-w-0 flex-1 bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
                  />
                </label>
              )}

              {/* 남길 수 없으면 고를 것이 없어 필터 · 일괄 선택을 두지 않는다. */}
              {canKeep && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div role="tablist" aria-label={t("listTitle")} className="flex flex-wrap gap-1.5">
                    {filters.map((item) => {
                      const isActive = filter === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => selectFilter(item.value)}
                          className={cn(
                            "body-7 flex h-8 items-center gap-1 rounded-full border px-3 transition-colors",
                            isActive
                              ? "border-font-2 bg-card text-font-1"
                              : "border-main text-font-2 hover:text-font-1",
                          )}
                        >
                          {item.label}
                          <span className="tabular-nums text-font-disabled">
                            {formatWithCommas(counts[item.value])}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      disabled={!canKeep || filtered.length === 0}
                      onClick={() => applyToFiltered("KEEP")}
                      className="body-7 h-8 rounded-lg border border-main px-3 text-font-1 transition-colors enabled:hover:bg-card disabled:text-font-disabled"
                    >
                      {t("bulk.keepAll")}
                    </button>
                    <button
                      type="button"
                      disabled={filtered.length === 0}
                      onClick={() => applyToFiltered("DELETE")}
                      className="body-7 h-8 rounded-lg border border-main px-3 text-font-1 transition-colors enabled:hover:bg-card disabled:text-font-disabled"
                    >
                      {t("bulk.deleteAll")}
                    </button>
                  </div>
                </div>
              )}

              {canKeep && isNarrowed && filtered.length > 0 && (
                <p className="body-8 text-font-disabled">
                  {t("bulk.scope", { count: formatWithCommas(filtered.length) })}
                </p>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="body-6 border-t border-main px-5 py-8 text-center text-font-2">
              {t("noMatch")}
            </p>
          ) : (
            <ul className="divide-y divide-main border-t border-main">
              {visible.map((candidate) => (
                <li key={candidate.universeId} className="flex items-center gap-3 px-5 py-3">
                  {candidate.profileImageUrl ? (
                    <ResourceImage
                      src={toImageVariantUrl(candidate.profileImageUrl, "sq80")}
                      alt=""
                      width={44}
                      height={44}
                      unoptimized
                      className="size-11 shrink-0 rounded-xl object-cover ring-1 ring-main"
                    />
                  ) : (
                    <span aria-hidden="true" className="size-11 shrink-0 rounded-xl bg-card" />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="title-5 truncate text-font-1">{candidate.title}</p>
                    <p className="body-7 flex items-center gap-1 text-font-2">
                      <Chat size={12} className="shrink-0" aria-hidden="true" />
                      {t("talking", { count: formatWithCommas(candidate.otherRoomCount) })}
                    </p>
                  </div>
                  {canKeep ? (
                    <ChoiceSegment
                      title={candidate.title}
                      choice={getChoice(candidate.universeId)}
                      canKeep={canKeep}
                      onSelect={(choice) => onChange(candidate.universeId, choice)}
                    />
                  ) : (
                    <span className="body-8 shrink-0 rounded-full border border-main px-2.5 py-1 text-font-2">
                      {t("willBeDeleted")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {(hiddenCount > 0 || visibleCount > PAGE_SIZE) && (
            <div className="flex border-t border-main">
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + MORE_SIZE)}
                  className="title-6 flex h-11 flex-1 items-center justify-center gap-1 text-font-2 transition-colors hover:bg-card/40 hover:text-font-1"
                >
                  {hiddenCount > MORE_SIZE ? (
                    <>
                      {t("showMore", { count: formatWithCommas(MORE_SIZE) })}
                      <span className="body-8 text-font-disabled tabular-nums">
                        {t("remaining", { count: formatWithCommas(hiddenCount) })}
                      </span>
                    </>
                  ) : (
                    t("showRest", { count: formatWithCommas(hiddenCount) })
                  )}
                </button>
              )}
              {visibleCount > PAGE_SIZE && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(PAGE_SIZE)}
                  className={cn(
                    "title-6 flex h-11 items-center justify-center px-5 text-font-2 transition-colors hover:bg-card/40 hover:text-font-1",
                    hiddenCount > 0 ? "border-l border-main" : "flex-1",
                  )}
                >
                  {t("showLess")}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default HandoverCandidateList;
