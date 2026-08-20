export interface RankedCharacter {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  chatCount: number;
  image: string;
}

export const DUMMY_RANKED_CHARACTERS: RankedCharacter[] = Array.from(
  { length: 24 },
  (_, index) => ({
    id: `ranking-character-${index}`,
    title: "흐물거리는 무말랭이",
    description: "매일 밤 골목 고양이들과 나누는 시시콜콜한 이야기",
    creatorName: "흐물거리는무말랭이",
    chatCount: 235,
    image: `https://picsum.photos/seed/ranking-${index}/374/490`,
  }),
);
