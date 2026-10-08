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
import { isAppError } from "@/lib/apiError";
import { invalidateUniverseLists } from "./invalidateUniverseLists";

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
  /** 성인 세계관. 성인인증이 유효하지 않은 제작자가 true 로 보내면 403 ADULT_VERIFICATION_REQUIRED. */
  adult?: boolean | null;
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

/** 고치려는 언어의 번역이 없을 때 서버가 주는 코드(404). */
const UNIVERSE_TRANSLATION_NOT_FOUND = "UNIVERSE_TRANSLATION_NOT_FOUND";

/**
 * language 는 "어느 언어 번역을 고칠지"다. 서버는 그 언어 번역이 없으면 404 로 거절한다.
 *
 * 세계관은 만든 사람의 언어 하나로만 번역이 생긴다. 상세 조회는 요청 언어 번역이 없으면 한국어로 떨어지므로,
 * 수정 화면에 채워진 글도 그 규칙을 따른다. 상세 응답에 원본 언어가 없어, 지금 언어로 먼저 보내고
 * 번역이 없다고 하면 상세가 보여 준 한국어 번역을 고친다.
 */
export const patchUniverseUpdate = async ({
  universeId,
  request,
}: PatchUniverseUpdateParams) => {
  try {
    await authAxios.patch(`/universe/${universeId}`, request);
  } catch (error) {
    if (
      request.language === "KO" ||
      !isAppError(error) ||
      error.code !== UNIVERSE_TRANSLATION_NOT_FOUND
    ) {
      throw error;
    }
    await authAxios.patch(`/universe/${universeId}`, {
      ...request,
      language: "KO",
    });
  }
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
      invalidateUniverseLists(queryClient, universeId);
    },
  });
};
