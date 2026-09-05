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
