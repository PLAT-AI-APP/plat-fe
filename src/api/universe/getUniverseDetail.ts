import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type {
  CharacterDetail,
  CharacterDetailComment,
  CharacterImageItem,
  CharacterScenario,
} from "@/type/character";

export type UniverseDetailVisibility = "PUBLIC" | "PRIVATE";
export type UniverseDetailTendency =
  "ALL" | "MALE_ORIENTED" | "FEMALE_ORIENTED";
export type UniverseDetailCategory =
  | "ROMANCE"
  | "FANTASY"
  | "DRAMA"
  | "MARTIAL_ARTS"
  | "GL"
  | "BL"
  | "HORROR"
  | "MYSTERY";

export interface UniverseDetailHashtag {
  hashtagId: string;
  label: string;
}

export interface UniverseDetailAsset {
  assetImageFileId: string;
  assetName: string;
  assetSituation: string;
  originalUrl: string;
}

export interface UniverseDetailScenario {
  scenarioId: string;
  episodeNo: number;
  displayOrder: number;
  name: string;
  content: string;
}

export interface UniverseDetailCharacter {
  universeCharacterId: string;
  name: string | null;
  description: string | null;
  detailSetting: string | null;
  profileImageUrl: string;
}

export interface UniverseDetailResponse {
  universeId: string;
  creatorId: string;
  editable: boolean;
  createdAt: string;
  updatedAt: string;
  visibility: UniverseDetailVisibility;
  commentEnabled: boolean;
  tendency: UniverseDetailTendency;
  category: UniverseDetailCategory;
  chatCount: number;
  likeCount: number;
  title: string;
  introduce: string;
  detailSetting: string;
  description: string;
  profileImageUrl: string;
  character: UniverseDetailCharacter;
  hashtags: UniverseDetailHashtag[];
  assets: UniverseDetailAsset[];
  scenarios: UniverseDetailScenario[];
}

export const getUniverseDetail = async (universeId: string) => {
  const response = await authAxios.get<UniverseDetailResponse>(
    `/universe/${universeId}`,
  );

  return response.data;
};

const createScenarioContents = (
  scenario: UniverseDetailScenario,
  assets: UniverseDetailAsset[],
): CharacterScenario["contents"] => [
  {
    id: `scenario-${scenario.scenarioId}-content`,
    type: "action" as const,
    value: scenario.content,
  },
  ...assets.map((asset) => ({
    id: `scenario-${scenario.scenarioId}-asset-${asset.assetImageFileId}`,
    type: "asset" as const,
    value: asset.originalUrl,
  })),
];

export const adaptUniverseDetailToCharacterDetail = (
  universe: UniverseDetailResponse,
): CharacterDetail => {
  const images: CharacterImageItem[] = universe.assets.map((asset) => ({
    id: asset.assetImageFileId,
    url: asset.originalUrl,
  }));
  const scenarios: CharacterScenario[] = universe.scenarios.map((scenario) => ({
    scenarioId: scenario.scenarioId,
    name: scenario.name,
    description: scenario.content,
    situation: scenario.content,
    firstDialogue: scenario.content,
    lang: "KO",
    contents: createScenarioContents(scenario, universe.assets),
  }));
  const comments: CharacterDetailComment[] = [];

  return {
    characterId: universe.universeId,
    title: universe.title,
    introduce: universe.introduce,
    prologue: universe.detailSetting,
    characterDescription: universe.description,
    chatCount: universe.chatCount,
    tags: universe.hashtags.map((hashtag) => hashtag.label),
    isOfficial: false,
    images,
    mainImage: universe.profileImageUrl,
    profileImage: universe.character.profileImageUrl,
    createdAt: universe.createdAt,
    updatedAt: universe.updatedAt,
    creator: {
      id: universe.creatorId,
      // 백엔드 세계관 상세 응답에는 제작자(creatorId)의 닉네임/프로필 사진을 조회하는 공개 API가
      // 아직 없어, 임시로 세계관 소속 캐릭터의 이름/이미지를 대신 표시합니다.
      nickname: universe.character.name ?? "",
      profileImage: universe.character.profileImageUrl,
      followingCount: 0,
      isFollowing: false,
    },
    scenarios,
    comments,
  };
};

export const useUniverseDetailQuery = (universeId?: string) => {
  return useQuery<UniverseDetailResponse, AppError>({
    queryKey: ["get-universe-detail", universeId],
    queryFn: () => getUniverseDetail(universeId ?? ""),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(universeId),
  });
};
