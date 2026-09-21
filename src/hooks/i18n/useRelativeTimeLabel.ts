"use client";

import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";

/**
 * 댓글 등록 시각을 "n초 전 ~ n년 전"처럼 사람이 읽기 쉬운 상대 시간으로 바꿉니다.
 * dayjs 기본 relativeTime 플러그인은 "한 시간 전"처럼 숫자를 생략하고 "주" 단위도 없어
 * 요구사항과 달라, 구간을 직접 나눕니다.
 */
export const useRelativeTimeLabel = () => {
  const t = useTranslations("characterDetail");

  return (date: string | number | Date) => {
    const target = dayjs(date);
    const now = dayjs();

    const seconds = now.diff(target, "second");
    if (seconds < 60) {
      return t("commentTimeSecondsAgo", { count: Math.max(seconds, 1) });
    }

    const minutes = now.diff(target, "minute");
    if (minutes < 60) return t("commentTimeMinutesAgo", { count: minutes });

    const hours = now.diff(target, "hour");
    if (hours < 24) return t("commentTimeHoursAgo", { count: hours });

    const days = now.diff(target, "day");
    if (days < 7) return t("commentTimeDaysAgo", { count: days });

    const weeks = now.diff(target, "week");
    if (weeks < 5) return t("commentTimeWeeksAgo", { count: weeks });

    const months = now.diff(target, "month");
    if (months < 12) return t("commentTimeMonthsAgo", { count: months });

    return t("commentTimeYearsAgo", { count: now.diff(target, "year") });
  };
};
