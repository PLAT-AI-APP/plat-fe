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

export interface UniverseUpdateCharacter {
  profileImageFileId?: string | null;
  name?: string | null;
  description?: string | null;
  detailSetting?: string | null;
}

export interface UniverseUpdateRequest {
  language: UniverseUpdateLanguage;
  profileImageFileId?: string | null;
  commentEnabled?: boolean | null;
  scenarios?: UniverseUpdateScenario[] | null;
  assets?: UniverseUpdateAsset[] | null;
  tendency?: UniverseUpdateTendency | null;
  visibility?: UniverseUpdateVisibility | null;
  title?: string | null;
  description?: string | null;
  tagIds?: string[] | null;
  category?: UniverseUpdateCategory | null;
  detailSetting?: string | null;
  introduce?: string | null;
  character?: UniverseUpdateCharacter | null;
}

export interface PatchUniverseUpdateParams {
  universeId: string;
  request: UniverseUpdateRequest;
}

export const patchUniverseUpdate = async ({
  universeId,
  request,
}: PatchUniverseUpdateParams) => {
  await authAxios.patch(`/universe/${universeId}`, request);
};

export const useUniverseUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AppError<PatchUniverseUpdateParams>,
    PatchUniverseUpdateParams
  >({
    mutationKey: ["patch-universe-update"],
    mutationFn: patchUniverseUpdate,
    onSuccess: (_, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["get-universe-detail", universeId],
      });
    },
  });
};
