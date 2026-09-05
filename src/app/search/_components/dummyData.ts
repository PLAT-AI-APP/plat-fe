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

// TODO: "최근 많은 사람들이 찾아본 캐릭터" 는 대응하는 API 가 아직 없어 더미로 둡니다.
// 검색 결과·실시간 검색어는 /search, /search/popular-terms 로 이미 연결돼 있습니다.
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
