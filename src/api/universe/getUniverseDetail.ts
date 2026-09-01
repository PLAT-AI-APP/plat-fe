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
  | "SIMULATION"
  | "ROMANCE"
  | "FANTASY"
  | "DRAMA"
  | "MARTIAL_ARTS_HISTORICAL"
  | "GL"
  | "BL"
  | "HORROR_MYSTERY"
  | "ACTION"
  | "COMIC_DAILY"
  | "SPORTS_SCHOOL"
  | "ETC";

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
  episodeNo: number;
  name: string;
  content: string;
}

export interface UniverseDetailResponse {
  universeId: string;
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
  characterName: string;
  characterProfileUrl: string;
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
    id: `scenario-${scenario.episodeNo}-content`,
    type: "action" as const,
    value: scenario.content,
  },
  ...assets.map((asset) => ({
    id: `scenario-${scenario.episodeNo}-asset-${asset.assetImageFileId}`,
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
    scenarioId: String(scenario.episodeNo),
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
    profileImage: universe.characterProfileUrl,
    createdAt: "",
    updatedAt: "",
    creator: {
      // TODO: 세계관 상세 조회 응답에 creatorId가 추가되면 이 값에 연결합니다.
      id: null,
      nickname: universe.characterName,
      profileImage: universe.characterProfileUrl,
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
