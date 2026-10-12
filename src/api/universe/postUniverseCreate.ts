import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { draftQueryKeys } from "@/api/draft/queryKeys";
import { invalidateUniverseLists } from "./invalidateUniverseLists";

export type UniverseCreateVisibility = "PUBLIC" | "PRIVATE";
export type UniverseCreateTendency = "ALL" | "MALE_ORIENTED" | "FEMALE_ORIENTED";
export type UniverseCreateLanguage = "KO" | "EN" | "JA" | "ZH" | "TH" | "VI";

export interface UniverseCreateScenario {
  name: string;
  description: string;
  content: string;
  /** 채팅방이 형식을 고르지 않았을 때 쓰는 응답 형식 코드. allowedResponseFormats 와 함께 비우면 NOVEL */
  defaultResponseFormat?: string;
  /** 채팅방에서 고를 수 있는 응답 형식 코드(GET /response-formats) */
  allowedResponseFormats?: string[];
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
  /** 성인 세계관. 성인인증이 유효하지 않은 제작자가 true 로 보내면 403 ADULT_VERIFICATION_REQUIRED. */
  adult?: boolean;
  description: string;
  tendency: UniverseCreateTendency;
  language: UniverseCreateLanguage;
  tagIds: string[];
  character: UniverseCreateCharacter;
  profileImageFileId: string;
  assets?: UniverseCreateAsset[];
  /**
   * 권리 책임 동의. 반드시 true — false·누락이면 400 INVALID_INPUT(fields.rightsAgreed).
   * 동의 시각은 서버가 세계관에 기록한다.
   */
  rightsAgreed: true;
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
  const queryClient = useQueryClient();

  return useMutation<
    UniverseCreateResponse,
    AppError<UniverseCreateRequest>,
    UniverseCreateRequest
  >({
    mutationKey: ["post-universe-create"],
    mutationFn: postUniverseCreate,
    // 새 세계관이 내 프로필·홈 목록에 바로 보이게 한다. 초안은 서버가 지웠으니 현재 초안도 다시 본다.
    onSuccess: () => {
      invalidateUniverseLists(queryClient);
      void queryClient.invalidateQueries({ queryKey: draftQueryKeys.current("UNIVERSE") });
    },
  });
};
