import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type {
  UniverseCreateAsset,
  UniverseCreateCategory,
  UniverseCreateLanguage,
  UniverseCreateScenario,
  UniverseCreateTendency,
  UniverseCreateVisibility,
} from "./postUniverseCreate";

export type UniverseUpdateVisibility = UniverseCreateVisibility;
export type UniverseUpdateTendency = UniverseCreateTendency;
export type UniverseUpdateLanguage = UniverseCreateLanguage;
export type UniverseUpdateCategory = UniverseCreateCategory;
export type UniverseUpdateScenario = UniverseCreateScenario;
export type UniverseUpdateAsset = UniverseCreateAsset;

export interface UniverseUpdateRequest {
  language: UniverseUpdateLanguage;
  commentEnabled?: boolean | null;
  scenarios?: UniverseUpdateScenario[] | null;
  assets?: UniverseUpdateAsset[] | null;
  tendency?: UniverseUpdateTendency | null;
  name?: string | null;
  visibility?: UniverseUpdateVisibility | null;
  title?: string | null;
  description?: string | null;
  tagIds?: string[] | null;
  category?: UniverseUpdateCategory | null;
  detailSetting?: string | null;
  introduce?: string | null;
}

export interface PatchUniverseUpdateParams {
  universeId: string;
  request: UniverseUpdateRequest;
  profileImage?: File;
  characterProfileImage?: File;
}

const createUniverseUpdateFormData = ({
  request,
  profileImage,
  characterProfileImage,
}: PatchUniverseUpdateParams) => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" }),
  );

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  if (characterProfileImage) {
    formData.append("characterProfileImage", characterProfileImage);
  }

  return formData;
};

export const patchUniverseUpdate = async (
  params: PatchUniverseUpdateParams,
) => {
  await authAxios.patch(
    `/universe/${params.universeId}`,
    createUniverseUpdateFormData(params),
  );
};

export const useUniverseUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError<PatchUniverseUpdateParams>, PatchUniverseUpdateParams>({
    mutationKey: ["patch-universe-update"],
    mutationFn: patchUniverseUpdate,
    onSuccess: (_, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["get-universe-detail", universeId],
      });
    },
  });
};
