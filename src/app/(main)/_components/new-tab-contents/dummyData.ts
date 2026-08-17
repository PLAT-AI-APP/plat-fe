export interface NewCharacter {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  chatCount: number;
  image: string;
}

export const DUMMY_NEW_CHARACTERS: NewCharacter[] = Array.from(
  { length: 24 },
  (_, index) => ({
    id: `new-character-${index}`,
    title: "흐물거리는 무말랭이",
    description: "매일 밤 골목 고양이들과 나누는 시시콜콜한 이야기",
    creatorName: "흐물거리는무말랭이",
    chatCount: 235,
    image: `https://picsum.photos/seed/new-character-${index}/374/490`,
  }),
);
