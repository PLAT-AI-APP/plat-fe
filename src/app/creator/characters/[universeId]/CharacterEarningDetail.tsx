"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { kstDateOf, kstMonth } from "@/lib/kst";
import { ArrowLeft, ArrowRight } from "@/icons";
import IconButton from "@/components/ui/IconButton";
import { QueryStateBoundary } from "@/components/state";
import { cn, formatWithCommas } from "@/lib/utils";
import {
  useEarningUniverseDaysQuery,
  useEarningUniverseQuery,
} from "@/api/earning/getEarningUniverse";
import CharacterThumb from "../../_components/CharacterThumb";

const shiftMonth = (month: string, amount: number) =>
  dayjs(`${month}-01`).add(amount, "month").format("YYYY-MM");

const SummarySkeleton = () => (
  <div className="h-48 animate-pulse rounded-3xl border border-main bg-darker" />
);

/** 캐릭터 하나의 수익. 누적 · 최근 7일 · 30일과 한 달씩 넘기는 날짜별 적립 · 정산 상태. */
const CharacterEarningDetail = ({ universeId }: { universeId: string }) => {
  const t = useTranslations("earnings");
  const thisMonth = kstMonth();
  const [month, setMonth] = useState(thisMonth);
  const summary = useEarningUniverseQuery(universeId);
  // 서버: 이 캐릭터의 한 달치 날짜별 합(최대 31줄)이라 쪽을 나누지 않는다.
  const { data: days = [] } = useEarningUniverseDaysQuery(universeId, month);
  const data = summary.data;

  return (
    <section className="flex flex-col gap-6">
      <Link
        href="/creator"
        className="body-5 flex w-fit items-center gap-1.5 text-font-2 transition-colors hover:text-font-1"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("center.title")}
      </Link>

      <QueryStateBoundary
        isPending={summary.isPending}
        isError={summary.isError}
        error={summary.error}
        onRetry={summary.refetch}
        pendingFallback={<SummarySkeleton />}
      >
        {data && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <CharacterThumb label={data} size={56} />
              <h1
                className={cn(
                  "heading-2 min-w-0 truncate",
                  !data.active && "text-font-2",
                )}
              >
                {data.title ?? t("characters.deleted")}
              </h1>
            </div>

            <div className="flex flex-col rounded-3xl border border-main bg-darker">
              <div className="flex flex-col gap-1 p-5">
                <span className="body-5 text-font-2">
                  {t("character.total")}
                </span>
                <span className="title-1 tabular-nums">
                  {t("points", { value: formatWithCommas(data.total) })}
                </span>
                <span className="body-7 text-font-2 tabular-nums">
                  {t("characters.paidChats", {
                    count: formatWithCommas(data.totalPaidTurns),
                  })}
                </span>
              </div>
              <dl className="grid grid-cols-2 divide-x divide-main border-t border-main">
                {[
                  { key: "week", value: data.week },
                  { key: "month", value: data.month },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col gap-1 px-5 py-4">
                    <dt className="body-6 text-font-2">
                      {t(`character.${item.key}`)}
                    </dt>
                    <dd className="title-4 tabular-nums">
                      +{t("points", { value: formatWithCommas(item.value) })}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </QueryStateBoundary>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="title-3">{t("character.daily")}</h2>
          <div className="flex items-center gap-2">
            <IconButton
              aria-label={t("prevMonth")}
              onClick={() => setMonth(shiftMonth(month, -1))}
            >
              <ArrowLeft className="size-3.5" />
            </IconButton>
            <span className="title-5 min-w-24 text-center tabular-nums">
              {dayjs(`${month}-01`).format(t("monthFormat"))}
            </span>
            <IconButton
              aria-label={t("nextMonth")}
              disabled={month >= thisMonth}
              onClick={() => setMonth(shiftMonth(month, 1))}
            >
              <ArrowRight className="size-3.5" />
            </IconButton>
          </div>
        </div>
        {days.length === 0 ? (
          <p className="body-5 rounded-3xl border border-main bg-darker px-5 py-10 text-center text-font-2">
            {t("character.emptyMonth")}
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-main rounded-3xl border border-main bg-darker px-5">
            {days.map((day) => (
              <li
                key={day.date}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="title-5">
                    {dayjs(day.date).format(t("dayWeekdayFormat"))}
                  </span>
                  <span className="body-7 text-font-2 tabular-nums">
                    {t("characters.paidChats", {
                      count: formatWithCommas(day.paidTurns),
                    })}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="title-4 tabular-nums text-brand-dark">
                    +{t("points", { value: formatWithCommas(day.points) })}
                  </span>
                  <span
                    className={cn(
                      "body-7 tabular-nums",
                      day.settled ? "text-font-disabled" : "text-font-2",
                    )}
                  >
                    {day.settled
                      ? t("calendar.settled")
                      : t("calendar.settleOn", {
                          date: kstDateOf(day.availableAt).format(t("dayFormat")),
                        })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default CharacterEarningDetail;
