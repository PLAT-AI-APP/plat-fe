import type { useTranslations } from "next-intl";
import type { RankingPeriod, RankingSort } from "@/api/ranking/getRanking";

type MessageKey = Parameters<ReturnType<typeof useTranslations>>[0];

/** 화면의 기간 pill. URL 쿼리에 그대로 실려 새로고침·공유가 된다. */
export const PERIOD_IDS = ["live", "daily", "weekly", "monthly"] as const;
export type PeriodId = (typeof PERIOD_IDS)[number];

export const PERIOD_TO_API: Record<PeriodId, RankingPeriod> = {
  live: "REALTIME",
  daily: "DAILY",
  weekly: "WEEKLY",
  monthly: "MONTHLY",
};

export const toPeriod = (value: string | null): RankingPeriod =>
  PERIOD_TO_API[(value ?? "live") as PeriodId] ?? "REALTIME";

/** 정렬 기준. 백엔드에 대응 지표가 있는 둘만 둔다. */
export const RANKING_SORTS = ["chats", "wish"] as const;
export type RankingSortId = (typeof RANKING_SORTS)[number];

export const RANKING_SORT_LABEL_KEYS: Record<RankingSortId, MessageKey> = {
  chats: "rankingPage.sortChats",
  wish: "rankingPage.sortWish",
};

export const SORT_TO_API: Record<RankingSortId, RankingSort> = {
  chats: "CHAT",
  wish: "LIKE",
};
