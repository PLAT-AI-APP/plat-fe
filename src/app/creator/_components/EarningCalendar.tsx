"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { kstDateOf, kstToday } from "@/lib/kst";
import { ArrowLeft, ArrowRight } from "@/icons";
import IconButton from "@/components/ui/IconButton";
import Button from "@/components/ui/Button";
import InfoTip from "@/components/ui/InfoTip";
import { cn, formatWithCommas } from "@/lib/utils";
import { useEarningCalendarQuery } from "@/api/earning/getEarningCalendar";
import { useEarningCalendarDayQuery } from "@/api/earning/getEarningCalendarDay";
import type { EarningCalendarDay } from "@/type/earning";
import CharacterThumb from "./CharacterThumb";

/** 일요일로 시작하는 한 주. 요일 이름은 화면 언어로 만든다. */
const SUNDAY = new Date(Date.UTC(2026, 9, 18));

/** 수익 캘린더. 그 달 수익과 날짜별로 들어온 포인트, 고른 날의 캐릭터별 내역. */
const EarningCalendar = () => {
  const t = useTranslations("earnings");
  const locale = useLocale();
  const today = kstToday();
  const [month, setMonth] = useState(today.startOf("month"));
  // 처음엔 아무 날도 고르지 않는다. 같은 날을 다시 누르면 닫힌다.
  const [selected, setSelected] = useState<string | null>(null);
  // 고를 때마다 늘려, 다시 고른 날도 처음 5개부터 보이게 한다.
  const [selection, setSelection] = useState(0);

  const monthKey = month.format("YYYY-MM");
  const { data: calendar } = useEarningCalendarQuery(monthKey);
  const dayQuery = useEarningCalendarDayQuery(selected, selection);

  const weekdays = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, {
      weekday: "narrow",
      timeZone: "UTC",
    });
    return Array.from({ length: 7 }, (_, i) =>
      format.format(new Date(SUNDAY.getTime() + i * 86_400_000)),
    );
  }, [locale]);

  /** 칸이 좁아 1만 이상은 짧게(1.2만). 정확한 값은 아래 그날 내역에 있다. */
  const formatCell = (value: number) =>
    value >= 10_000
      ? new Intl.NumberFormat(locale, {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      : formatWithCommas(value);

  const byDate = new Map<string, EarningCalendarDay>(
    (calendar?.month === monthKey ? calendar.days : []).map((day) => [
      day.date,
      day,
    ]),
  );
  const days = Array.from({ length: month.daysInMonth() }, (_, i) =>
    month.add(i, "day"),
  );
  const leading = month.day();
  const isThisMonth = month.isSame(today, "month");

  const moveMonth = (amount: number) => {
    setMonth(month.add(amount, "month"));
    setSelected(null);
  };

  const selectedDay = selected ? byDate.get(selected) : undefined;
  const items = dayQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="title-3 flex items-center gap-1.5">
        {t("calendar.title")}
        <InfoTip text={t("calendar.tip")} />
      </h2>

      <div className="flex flex-col rounded-3xl border border-main bg-darker">
        <div className="flex flex-col items-center gap-1 px-5 pt-5">
          <div className="flex items-center gap-2">
            <IconButton
              aria-label={t("prevMonth")}
              onClick={() => moveMonth(-1)}
            >
              <ArrowLeft className="size-3.5" />
            </IconButton>
            <span className="body-5 min-w-32 text-center tabular-nums text-font-2">
              {t("calendar.monthTotal", {
                month: month.format(t("monthFormat")),
              })}
            </span>
            <IconButton
              aria-label={t("nextMonth")}
              disabled={isThisMonth}
              onClick={() => moveMonth(1)}
            >
              <ArrowRight className="size-3.5" />
            </IconButton>
          </div>
          <span className="title-1 tabular-nums">
            {t("points", {
              value: formatWithCommas(
                calendar?.month === monthKey ? calendar.total : 0,
              ),
            })}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 p-3 sm:p-4">
          {weekdays.map((weekday, index) => (
            <span key={index} className="body-7 py-1.5 text-center text-font-2">
              {weekday}
            </span>
          ))}
          {Array.from({ length: leading }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const date = day.format("YYYY-MM-DD");
            const earned = byDate.get(date);
            // 오늘 쓴 노트는 내일 적립이라 오늘부터는 고를 것이 없다.
            const isFuture = !day.isBefore(today, "day");
            const isSelected = selected === date;
            const isToday = day.isSame(today, "day");
            return (
              <button
                key={date}
                type="button"
                disabled={isFuture}
                aria-pressed={isSelected}
                aria-label={`${day.format(t("dayFormat"))} ${t("points", {
                  value: formatWithCommas(earned?.points ?? 0),
                })}`}
                onClick={() => {
                  setSelected(isSelected ? null : date);
                  setSelection((prev) => prev + 1);
                }}
                className={cn(
                  "flex h-14 min-w-0 flex-col items-center gap-1 rounded-xl pt-1.5 transition-colors",
                  isSelected
                    ? "bg-font-1/[0.08]"
                    : "enabled:hover:bg-font-1/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "body-6 tabular-nums",
                    isFuture && !isToday ? "text-font-disabled" : "text-font-1",
                    isToday && "title-6 text-brand",
                  )}
                >
                  {day.date()}
                </span>
                {earned && (
                  <span
                    className={cn(
                      "body-8 max-w-full truncate px-0.5 tabular-nums",
                      earned.settled ? "text-brand-dark" : "text-font-2",
                    )}
                  >
                    +{formatCell(earned.points)}
                  </span>
                )}
              </button>
            );
          })}
          <div className="body-8 col-span-7 flex justify-end gap-3 pt-2 text-font-2">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-brand-dark" />
              {t("calendar.settled")}
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-font-2" />
              {t("calendar.pending")}
            </span>
          </div>
        </div>

        {selected && (
          <div className="flex flex-col border-t border-main px-5 pt-4 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="title-4">
                  {dayjs(selected).format(t("dayWeekdayFormat"))}
                </span>
                {selectedDay && (
                  <span className="body-7 text-font-2">
                    {selectedDay.settled
                      ? t("calendar.settled")
                      : t("calendar.settleOn", {
                          date: kstDateOf(selectedDay.availableAt).format(
                            t("dayFormat"),
                          ),
                        })}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "title-4 tabular-nums",
                  selectedDay?.settled ? "text-brand-dark" : "text-font-2",
                )}
              >
                +
                {t("points", {
                  value: formatWithCommas(selectedDay?.points ?? 0),
                })}
              </span>
            </div>
            {!selectedDay ? (
              <p className="body-5 py-8 text-center text-font-2">
                {t("calendar.emptyDay")}
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-main">
                {items.map((row) => (
                  <li key={row.universeId}>
                    <Link
                      href={`/creator/characters/${row.universeId}`}
                      className="flex items-center gap-3 py-3"
                    >
                      <CharacterThumb label={row} size={36} />
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
                            count: formatWithCommas(row.paidTurns),
                          })}
                        </span>
                      </div>
                      <span className="title-5 shrink-0 tabular-nums">
                        +{t("points", { value: formatWithCommas(row.points) })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {dayQuery.hasNextPage && (
              <Button
                size="md"
                variant="ghost"
                fullWidth
                className="my-2"
                isPending={dayQuery.isFetchingNextPage}
                onClick={() => dayQuery.fetchNextPage()}
              >
                {t("calendar.more")}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default EarningCalendar;
