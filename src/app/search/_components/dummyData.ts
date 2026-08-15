import type { SearchUserResult } from "./UserResultCard";

export interface SearchCharacterResult {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  chatCount: number;
  image: string;
  isNew?: boolean;
  isOfficial?: boolean;
}

export const DUMMY_SEARCH_CHARACTERS: SearchCharacterResult[] = Array.from(
  { length: 9 },
  (_, index) => ({
    id: `search-character-${index}`,
    title: "흐물거리는 무말랭이",
    description: "매일 밤 골목 고양이들과 나누는 시시콜콜한 이야기",
    creatorName: "흐물거리는무말랭이",
    chatCount: 235,
    image: `https://picsum.photos/seed/search-character-${index}/374/490`,
    isNew: index % 4 === 0,
  }),
);

export const DUMMY_SEARCH_WORLDS: SearchCharacterResult[] = Array.from(
  { length: 9 },
  (_, index) => ({
    id: `search-world-${index}`,
    title: "고양이 마을 세계관",
    description: "골목마다 고양이 대장이 정해져 있는 작은 마을 이야기",
    creatorName: "흐물거리는무말랭이",
    chatCount: 128,
    image: `https://picsum.photos/seed/search-world-${index}/374/490`,
    isOfficial: index % 5 === 0,
  }),
);

export const DUMMY_SEARCH_USERS: SearchUserResult[] = Array.from(
  { length: 3 },
  (_, index) => ({
    userId: `search-user-${index}`,
    nickname: "흐물거리는달팽이",
    followerCount: 1293,
    chatVolumeLabel: "12k",
    isFollowing: index === 1,
  }),
);
