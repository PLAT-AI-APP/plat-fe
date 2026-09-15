import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export type UniverseCreateVisibility = "PUBLIC" | "PRIVATE";
export type UniverseCreateTendency = "ALL" | "MALE_ORIENTED" | "FEMALE_ORIENTED";
export type UniverseCreateLanguage = "KO" | "EN" | "JA" | "ZH" | "TH" | "VI";
export type UniverseCreateCategory =
  | "ROMANCE"
  | "FANTASY"
  | "DRAMA"
  | "MARTIAL_ARTS"
  | "GL"
  | "BL"
  | "HORROR"
  | "MYSTERY";

export interface UniverseCreateScenario {
  name: string;
  description: string;
  content: string;
}

export interface UniverseCreateAsset {
  assetImageFileId: string;
  assetName: string;
  assetSituation: string;
}

export interface UniverseCreateCharacter {
  profileImageFileId: string;
  name: string;
  description: string;
  detailSetting: string;
}

export interface UniverseCreateRequest {
  title: string;
  introduce: string;
  detailSetting: string;
  scenarios: UniverseCreateScenario[];
  visibility: UniverseCreateVisibility;
  commentEnabled: boolean;
  description: string;
  tendency: UniverseCreateTendency;
  category: UniverseCreateCategory;
  language: UniverseCreateLanguage;
  tagIds: string[];
  character: UniverseCreateCharacter;
  profileImageFileId: string;
  assets?: UniverseCreateAsset[];
  /** 이 초안에서 세계관을 만든 경우 삭제할 본인 소유 UNIVERSE 임시 저장 ID. 일반 생성은 생략합니다. */
  draftId?: string;
}

export interface UniverseCreateResponse {
  universeId: string;
  universeCharacterId: string;
}

export const postUniverseCreate = async (request: UniverseCreateRequest) => {
  const response = await authAxios.post<UniverseCreateResponse>(
    "/universe",
    request,
  );

  return response.data;
};

export const useUniverseCreateMutation = () => {
  return useMutation<
    UniverseCreateResponse,
    AppError<UniverseCreateRequest>,
    UniverseCreateRequest
  >({
    mutationKey: ["post-universe-create"],
    mutationFn: postUniverseCreate,
  });
};
