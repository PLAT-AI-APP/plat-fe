import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type {
  CharacterDetail,
  CharacterDetailComment,
  CharacterImageItem,
  CharacterScenario,
} from "@/type/character";
import { universeQueryKeys } from "./queryKeys";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";

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
  description: string;
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
  /** 창작자(Creator) 도메인 식별자. 팔로우 등 유저 기능에는 creatorUserId를 씁니다. */
  creatorId: string;
  creatorUserId: string;
  creatorName: string;
  creatorFollowerCount: number;
  editable: boolean;
  createdAt: string;
  updatedAt: string;
  visibility: UniverseDetailVisibility;
  commentEnabled: boolean;
  tendency: UniverseDetailTendency;
  category: UniverseDetailCategory;
  chatCount: number;
  likeCount: number;
  /** 이 요청을 보낸 사람이 찜했는지. 비로그인이면 항상 false 입니다. */
  liked: boolean;
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
    description: scenario.description,
    situation: scenario.content,
    firstDialogue: scenario.content,
    lang: "KO",
    contents: createScenarioContents(scenario, universe.assets),
  }));
  const comments: CharacterDetailComment[] = [];

  return {
    characterId: universe.universeId,
    title: universe.title,
    characterName: universe.character.name ?? "",
    introduce: universe.introduce,
    prologue: universe.detailSetting,
    characterDescription: universe.description,
    chatCount: universe.chatCount,
    likeCount: universe.likeCount,
    commentEnabled: universe.commentEnabled,
    liked: universe.liked,
    editable: universe.editable,
    tags: universe.hashtags.map((hashtag) => hashtag.label),
    isOfficial: false,
    images,
    mainImage: universe.profileImageUrl,
    profileImage: universe.character.profileImageUrl,
    createdAt: universe.createdAt,
    updatedAt: universe.updatedAt,
    creator: {
      // 팔로우 등 유저 기능은 UserId 기준이라 creatorId(Creator 도메인 식별자)가 아니라
      // creatorUserId를 씁니다.
      id: universe.creatorUserId,
      nickname: universe.creatorName,
      // 세계관 상세 응답에는 창작자 프로필 사진이 없다. 캐릭터 이미지로 대신 채우면 다른 사람의
      // 사진이 창작자인 것처럼 보이므로 여기 두지 않고, 화면이 공개 프로필 API 로 따로 가져온다.
      followerCount: universe.creatorFollowerCount,
      // 이 요청을 보낸 사람이 창작자를 팔로우하는지는 아직 상세 응답에 실려 오지 않습니다.
      isFollowing: false,
    },
    scenarios,
    comments,
  };
};

export const useUniverseDetailQuery = (universeId?: string) => {
  // 세계관 상세는 로그인이 필수라, 보고 있던 중 세션이 만료되면 401로 실패한
  // 채 멈춘다. 쿼리 키에 로그인 상태를 반영해 두면, 로그인 안내 모달에서 다시
  // 로그인했을 때 키가 바뀌면서 자동으로 재요청된다 — 새로고침 없이도 내용이 채워진다.
  const authReady = useAuthReady();
  const isAuthChecked = useAuthStore((state) => state.isAuthReady);

  return useQuery<UniverseDetailResponse, AppError>({
    queryKey: [...universeQueryKeys.detail(universeId), authReady],
    queryFn: () => getUniverseDetail(universeId ?? ""),
    // 인증 확인 전에 먼저 받으면, 확인이 끝나 키가 바뀔 때 처음부터 다시 로딩한다.
    enabled: Boolean(universeId) && isAuthChecked,
  });
};
