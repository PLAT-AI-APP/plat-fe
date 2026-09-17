import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { RankedCardItem, RankTrend } from "@/api/ranking/getRanking";

/** RankingController(plat-boot) 기준. 로그인 없이도 호출되며, 그때 카드의 liked는 항상 false다. */

interface SeedRankItem {
  universeId: string;
  title: string;
  description: string;
  nickname: string;
  chatCount: number;
  likeCount: number;
  isNew: boolean;
  isOfficial: boolean;
  /** 직전 스냅샷 대비 등락. NEW/OFFICIAL 범위는 스냅샷이 없어 이 값을 쓰지 않는다. */
  trend: RankTrend;
}

const SEED_ITEMS: SeedRankItem[] = [
  {
    universeId: "ranking-1",
    title: "당신을 기다려온 소꿉친구",
    description: "밝고 명랑하지만 수줍음이 많은 당신의 오랜 친구입니다.",
    nickname: "흐물거리는달팽이",
    chatCount: 12500,
    likeCount: 3400,
    isNew: false,
    isOfficial: true,
    trend: "UP",
  },
  {
    universeId: "ranking-2",
    title: "밤하늘의 마법사",
    description: "별자리를 읽는 법을 알려주는 신비로운 마법사입니다.",
    nickname: "숲의마법사",
    chatCount: 9800,
    likeCount: 4100,
    isNew: true,
    isOfficial: false,
    trend: "NEW",
  },
  {
    universeId: "ranking-3",
    title: "미스터리 탐정 셜록",
    description: "흥미로운 사건이군. 함께 진실을 찾아볼까?",
    nickname: "안개속탐정",
    chatCount: 8700,
    likeCount: 2100,
    isNew: false,
    isOfficial: false,
    trend: "DOWN",
  },
  {
    universeId: "ranking-4",
    title: "옆자리 불량학생",
    description: "오늘 학교 끝나고 뭐 해? 라고 묻는 새침한 반친구.",
    nickname: "리온빌더",
    chatCount: 6400,
    likeCount: 5200,
    isNew: true,
    isOfficial: false,
    trend: "SAME",
  },
  {
    universeId: "ranking-5",
    title: "우주 정거장 AI 안나",
    description: "현재 산소 포화도 98%입니다. 다음 목적지를 안내할까요?",
    nickname: "안나개발자",
    chatCount: 5100,
    likeCount: 1800,
    isNew: false,
    isOfficial: true,
    trend: "UP",
  },
  {
    universeId: "ranking-6",
    title: "조선 시대 무사 강혁",
    description: "이 칼 끝은 오직 정의만을 향한다.",
    nickname: "강혁의칼",
    chatCount: 3200,
    likeCount: 900,
    isNew: false,
    isOfficial: false,
    trend: "DOWN",
  },
  {
    universeId: "ranking-7",
    title: "냉혹한 춤꾼",
    description: "음악이 멈추면 모든 게 끝나는 거야.",
    nickname: "춤추는그림자",
    chatCount: 2100,
    likeCount: 6100,
    isNew: true,
    isOfficial: false,
    trend: "NEW",
  },
];

const isAuthenticated = (request: Request) => Boolean(request.headers.get("authorization"));

const toRankedCard = (
  item: SeedRankItem,
  rank: number,
  sort: string,
  scope: string,
  liked: boolean,
): RankedCardItem => ({
  rank,
  score: sort === "LIKE" ? item.likeCount : item.chatCount,
  // 신작·공식 랭킹은 직전 스냅샷이 없어 등락이 내려오지 않는다.
  trend: scope === "ALL" ? item.trend : null,
  card: {
    universeId: item.universeId,
    images: [`https://picsum.photos/seed/${item.universeId}/374/490`],
    title: item.title,
    description: item.description,
    creator: { creatorId: `creator-${item.universeId}`, nickname: item.nickname },
    chatCount: item.chatCount,
    isNew: item.isNew,
    isOfficial: item.isOfficial,
    ...{ liked },
  },
});

export const rankingHandlers = [
  http.get(endpoint("/ranking"), ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") ?? "REALTIME";
    const sort = url.searchParams.get("sort") ?? "CHAT";
    const scope = url.searchParams.get("scope") ?? "ALL";
    const tendency = url.searchParams.get("tendency") ?? "ALL";
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "24", 10);

    let pool = SEED_ITEMS;
    if (scope === "NEW") pool = pool.filter((item) => item.isNew);
    if (scope === "OFFICIAL") pool = pool.filter((item) => item.isOfficial);
    // MALE_ORIENTED/FEMALE_ORIENTED 로 나눌 실제 성향 데이터가 없어 ALL 이외 탭은 짝수 인덱스만 노출합니다.
    if (tendency !== "ALL") pool = pool.filter((_, index) => index % 2 === 0);

    // period는 목업에서 실제 집계 구간을 재현하지 않고 같은 점수를 그대로 사용합니다.
    void period;

    const sorted = [...pool].sort((a, b) =>
      sort === "LIKE" ? b.likeCount - a.likeCount : b.chatCount - a.chatCount,
    );

    const authenticated = isAuthenticated(request);
    const content = sorted
      .slice(page * size, page * size + size)
      .map((item, index) =>
        toRankedCard(item, page * size + index + 1, sort, scope, authenticated && index === 0),
      );

    return HttpResponse.json({
      page: {
        number: page,
        size,
        numberOfElements: content.length,
        hasNext: (page + 1) * size < sorted.length,
        totalElements: sorted.length,
        totalPages: Math.max(Math.ceil(sorted.length / size), 1),
      },
      content,
    });
  }),
];
