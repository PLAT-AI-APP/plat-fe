"use client";

import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export interface DraftUpdateRequest {
  title: string;
  payload: object;
  fileIds?: string[];
}

export interface DraftUpdateResponse {
  draftId: string;
}

export interface PutDraftUpdateParams {
  draftId: string;
  request: DraftUpdateRequest;
}

// payload는 부분 병합이 아니라 전체 교체라, 매번 최신 폼 상태 전체를 다시 보내야 한다.
export const putDraftUpdate = async ({
  draftId,
  request,
}: PutDraftUpdateParams) => {
  const response = await authAxios.put<DraftUpdateResponse>(
    `/drafts/${draftId}`,
    request,
  );

  return response.data;
};

export const useDraftUpdateMutation = () => {
  return useMutation<
    DraftUpdateResponse,
    AppError<PutDraftUpdateParams>,
    PutDraftUpdateParams
  >({
    mutationKey: ["put-draft-update"],
    mutationFn: putDraftUpdate,
    // 저장 실패는 useUniverseDraft 가 직접 알린다. 전역 토스트까지 뜨면 두 번 말한다.
    meta: { silent: true },
  });
};
