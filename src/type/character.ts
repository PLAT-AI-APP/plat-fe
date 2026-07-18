// 시나리오 프리뷰에 쌓이는 콘텐츠의 렌더링 종류를 구분합니다.
export type ScenarioType = "chat" | "userChat" | "action" | "asset";

// 개별 시나리오 콘텐츠 아이템 정의
export interface ScenarioContentItem {
  id: string;
  type: ScenarioType;
  value: string;
}

export interface CharacterScenario {
  scenarioId: string;
  name: string;
  situation: string;
  firstDialogue: string;
  lang: string;
  description?: string;
  contents?: ScenarioContentItem[];
}

export interface CharacterDetailComment {
  id: string;
  authorName: string;
  authorImage: string;
  content: string;
  createdAt: string;
  isCreator?: boolean;
}

export interface CharacterImageItem {
  id: string;
  url: string;
}

export interface CharacterDetail {
  characterId: string;
  title: string;
  introduce: string;
  prologue: string;
  characterDescription: string;
  chatCount: number;
  tags: string[];
  isOfficial: boolean;
  images: CharacterImageItem[];
  mainImage: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    nickname: string;
    profileImage: string;
    followingCount: number;
    isFollowing: boolean;
  };
  scenarios: CharacterScenario[];
  comments: CharacterDetailComment[];
}
