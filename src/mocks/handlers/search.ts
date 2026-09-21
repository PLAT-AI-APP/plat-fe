import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { CategoryCardItem, CategoryCardTag } from "@/api/search/getCategorySearch";
import type { SearchCardItem, SearchUserItem } from "@/api/search/getSearch";
import type { PopularSearchTerm } from "@/api/search/getPopularSearchTerms";

/** SearchController(plat-boot) 기준. 로그인 없이도 호출되므로 Authorization 헤더 유무로 liked/following을 가른다. */

const TAGS: CategoryCardTag[] = [
  { tagId: "11", name: "소꿉친구" },
  { tagId: "12", name: "판타지" },
  { tagId: "13", name: "일상" },
  { tagId: "14", name: "로맨스" },
  { tagId: "15", name: "스릴러" },
];

interface SeedUniverse {
  universeId: string;
  title: string;
  description: string;
  nickname: string;
  chatCount: number;
  tagIds: string[];
  isNew: boolean;
  isOfficial: boolean;
}

const SEED_UNIVERSES: SeedUniverse[] = [
  {
    universeId: "search-universe-1",
    title: "당신을 기다려온 소꿉친구",
    description: "밝고 명랑하지만 수줍음이 많은 당신의 오랜 친구입니다.",
    nickname: "흐물거리는달팽이",
    chatCount: 1200,
    tagIds: ["11", "13"],
    isNew: false,
    isOfficial: true,
  },
  {
    universeId: "search-universe-2",
    title: "밤하늘의 마법사",
    description: "별자리를 읽는 법을 알려주는 신비로운 마법사입니다.",
    nickname: "숲의마법사",
    chatCount: 860,
    tagIds: ["12"],
    isNew: true,
    isOfficial: false,
  },
  {
    universeId: "search-universe-3",
    title: "미스터리 탐정 셜록",
    description: "흥미로운 사건이군. 함께 진실을 찾아볼까?",
    nickname: "안개속탐정",
    chatCount: 430,
    tagIds: ["15"],
    isNew: false,
    isOfficial: false,
  },
  {
    universeId: "search-universe-4",
    title: "옆자리 불량학생",
    description: "오늘 학교 끝나고 뭐 해? 라고 묻는 새침한 반친구.",
    nickname: "리온빌더",
    chatCount: 95,
    tagIds: ["13", "14"],
    isNew: true,
    isOfficial: false,
  },
  {
    universeId: "search-universe-5",
    title: "우주 정거장 AI 안나",
    description: "현재 산소 포화도 98%입니다. 다음 목적지를 안내할까요?",
    nickname: "안나개발자",
    chatCount: 312,
    tagIds: ["12", "15"],
    isNew: false,
    isOfficial: true,
  },
];

interface SeedCharacter {
  universeId: string;
  name: string;
  description: string;
  nickname: string;
  chatCount: number;
}

const SEED_CHARACTERS: SeedCharacter[] = [
  {
    universeId: "search-character-1",
    name: "연우",
    description: "매주 목요일마다 카페에서 당신을 기다리는 소꿉친구입니다.",
    nickname: "흐물거리는달팽이",
    chatCount: 640,
  },
  {
    universeId: "search-character-2",
    name: "리온",
    description: "네온 사인이 깜빡이는 뒷골목의 사이버펑크 해커입니다.",
    nickname: "리온빌더",
    chatCount: 210,
  },
];

const SEED_USERS = [
  { userId: "search-user-1", nickname: "흐물거리는달팽이", followerCount: 152, chatCount: 3200 },
  { userId: "search-user-2", nickname: "숲의마법사", followerCount: 88, chatCount: 940 },
  { userId: "search-user-3", nickname: "안개속탐정", followerCount: 41, chatCount: 430 },
];

const POPULAR_TERMS: PopularSearchTerm[] = [
  { rank: 1, keyword: "소꿉친구", count: 4820, trend: "SAME" },
  { rank: 2, keyword: "마법사", count: 3910, trend: "UP" },
  { rank: 3, keyword: "탐정", count: 2870, trend: "DOWN" },
  { rank: 4, keyword: "사이버펑크", count: 1990, trend: "NEW" },
  { rank: 5, keyword: "로맨스", count: 1540, trend: "UP" },
  { rank: 6, keyword: "학원물", count: 1102, trend: "SAME" },
  { rank: 7, keyword: "우주", count: 980, trend: "DOWN" },
  { rank: 8, keyword: "일상", count: 760, trend: "NEW" },
  { rank: 9, keyword: "스릴러", count: 610, trend: "UP" },
  { rank: 10, keyword: "판타지", count: 540, trend: "SAME" },
];

const isAuthenticated = (request: Request) => Boolean(request.headers.get("authorization"));

/**
 * 실서버 BaseCard는 liked를 항상 함께 내려주지만(로그인하지 않았으면 false),
 * FE의 SearchCardItem 타입은 liked를 선언하지 않습니다(카테고리 검색의 LikableCard와 다른 점).
 * 검색 화면은 그 필드를 쓰지 않으므로 타입에 맞춰 생략합니다.
 */
const toBaseCard = (universe: SeedUniverse): SearchCardItem => ({
  universeId: universe.universeId,
  images: [`https://picsum.photos/seed/${universe.universeId}/374/490`],
  title: universe.title,
  description: universe.description,
  creator: { creatorId: `creator-${universe.universeId}`, nickname: universe.nickname },
  chatCount: universe.chatCount,
  isNew: universe.isNew,
  isOfficial: universe.isOfficial,
});

const toCharacterCard = (character: SeedCharacter): SearchCardItem => ({
  universeId: character.universeId,
  images: [`https://picsum.photos/seed/${character.universeId}/374/490`],
  title: character.name,
  description: character.description,
  creator: { creatorId: `creator-${character.universeId}`, nickname: character.nickname },
  chatCount: character.chatCount,
  isNew: false,
  isOfficial: false,
});

const toCategoryCard = (universe: SeedUniverse, liked: boolean): CategoryCardItem => ({
  ...toBaseCard(universe),
  liked,
  tags: TAGS.filter((tag) => universe.tagIds.includes(tag.tagId)),
});

const matches = (keyword: string, ...fields: string[]) =>
  fields.some((field) => field.toLowerCase().includes(keyword.toLowerCase()));

const paginate = <T>(items: T[], page: number, size: number) => {
  const content = items.slice(page * size, page * size + size);
  return {
    page: {
      number: page,
      size,
      numberOfElements: content.length,
      hasNext: (page + 1) * size < items.length,
      totalElements: items.length,
      totalPages: Math.max(Math.ceil(items.length / size), 1),
    },
    content,
  };
};

export const searchHandlers = [
  // 키워드 검색. 2자 미만이면 서버도 400으로 돌려보낸다(SearchPolicy.MIN_KEYWORD_LENGTH).
  http.get(endpoint("/search"), ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "9", 10);

    if (!q) {
      return HttpResponse.json(
        { code: "INVALID_INPUT", message: "요청 값이 올바르지 않습니다.", fields: { q: "검색어를 입력해주세요." } },
        { status: 400 },
      );
    }
    if (q.length < 2) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "요청 값이 올바르지 않습니다.",
          fields: { q: "검색어는 2자 이상이어야 합니다." },
        },
        { status: 400 },
      );
    }

    // 로그인하지 않았으면 following은 항상 false. 로그인 상태에서는 첫 번째 유저만 팔로우 중인 것으로 흉내 낸다.
    const authenticated = isAuthenticated(request);
    const characters = SEED_CHARACTERS.filter((character) =>
      matches(q, character.name, character.description),
    ).map(toCharacterCard);
    const universes = SEED_UNIVERSES.filter((universe) =>
      matches(q, universe.title, universe.description),
    ).map(toBaseCard);
    const users: SearchUserItem[] = SEED_USERS.filter((user) => matches(q, user.nickname)).map(
      (user, index) => ({
        userId: user.userId,
        nickname: user.nickname,
        profileImageUrl: null,
        followerCount: user.followerCount,
        chatCount: user.chatCount,
        following: authenticated && index === 0,
      }),
    );

    return HttpResponse.json({
      characters: paginate(characters, page, size),
      universes: paginate(universes, page, size),
      users: paginate(users, page, size),
    });
  }),

  // 카테고리(태그) 검색. 고른 태그를 전부 가진 세계관만 남는다.
  http.get(endpoint("/search/category"), ({ request }) => {
    const url = new URL(request.url);
    const tagIds = (url.searchParams.get("tagIds") ?? "").split(",").filter(Boolean);
    const sort = url.searchParams.get("sort") ?? "CHAT";
    const tendency = url.searchParams.get("tendency") ?? "ALL";
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "24", 10);

    if (tagIds.length > 5) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "요청 값이 올바르지 않습니다.",
          fields: { tagIds: "태그는 최대 5개까지 선택할 수 있습니다." },
        },
        { status: 400 },
      );
    }

    // MALE_ORIENTED/FEMALE_ORIENTED 로 나눌 실제 성향 데이터가 없어 ALL 이외 탭은 짝수 인덱스만 노출합니다.
    let filtered = SEED_UNIVERSES.filter((universe, index) =>
      tendency === "ALL" ? true : index % 2 === 0,
    );
    if (tagIds.length > 0) {
      filtered = filtered.filter((universe) => tagIds.every((tagId) => universe.tagIds.includes(tagId)));
    }
    const sorted =
      sort === "LATEST"
        ? [...filtered].reverse()
        : [...filtered].sort((a, b) => b.chatCount - a.chatCount);

    const authenticated = isAuthenticated(request);
    const content: CategoryCardItem[] = sorted.map((universe) =>
      toCategoryCard(universe, authenticated && universe.universeId === "search-universe-1"),
    );

    return HttpResponse.json(paginate(content, page, size));
  }),

  // 실시간 인기 검색어. 1분 스냅샷을 흉내 내 항상 같은 목록을 size만큼 잘라 준다.
  http.get(endpoint("/search/popular-terms"), ({ request }) => {
    const size = parseInt(new URL(request.url).searchParams.get("size") || "10", 10);
    return HttpResponse.json(POPULAR_TERMS.slice(0, size));
  }),
];
