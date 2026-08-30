import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export type UniverseCreateVisibility = "PUBLIC" | "PRIVATE";
export type UniverseCreateTendency = "ALL" | "MALE" | "FEMALE";
export type UniverseCreateLanguage = "KO" | "EN" | "JA" | "ZH" | "TH" | "VI";
export type UniverseCreateCategory =
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

export interface UniverseCreateScenario {
  name: string;
  content: string;
}

export interface UniverseCreateAsset {
  assetImageFileId: string;
  assetName: string;
  assetSituation: string;
}

export interface UniverseCreateRequest {
  commentEnabled: boolean;
  scenarios: UniverseCreateScenario[];
  assets: UniverseCreateAsset[];
  tendency: UniverseCreateTendency;
  name: string;
  visibility: UniverseCreateVisibility;
  title: string;
  language: UniverseCreateLanguage;
  description: string;
  tagIds: string[];
  category: UniverseCreateCategory;
  detailSetting: string;
  introduce: string;
}

export interface PostUniverseCreateParams {
  request: UniverseCreateRequest;
  profileImage: File;
  characterProfileImage: File;
}

export interface UniverseCreateResponse {
  universeId: string;
  characterId: string;
}

const createUniverseCreateFormData = ({
  request,
  profileImage,
  characterProfileImage,
}: PostUniverseCreateParams) => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" }),
  );
  formData.append("profileImage", profileImage);
  formData.append("characterProfileImage", characterProfileImage);

  return formData;
};

export const postUniverseCreate = async (params: PostUniverseCreateParams) => {
  const response = await authAxios.post<UniverseCreateResponse>(
    "/universe",
    createUniverseCreateFormData(params),
  );

  return response.data;
};

export const useUniverseCreateMutation = () => {
  return useMutation<
    UniverseCreateResponse,
    AppError<PostUniverseCreateParams>,
    PostUniverseCreateParams
  >({
    mutationKey: ["post-universe-create"],
    mutationFn: postUniverseCreate,
  });
};
