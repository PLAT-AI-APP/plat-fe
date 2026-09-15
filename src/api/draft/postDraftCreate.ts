"use client";

import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export type DraftType = "CHARACTER" | "NOTICE" | "UNIVERSE";

export interface DraftCreateRequest {
  type: DraftType;
  title: string;
  payload: object;
  fileIds?: string[];
}

export interface DraftCreateResponse {
  draftId: string;
}

export const postDraftCreate = async (request: DraftCreateRequest) => {
  const response = await authAxios.post<DraftCreateResponse>(
    "/drafts",
    request,
  );

  return response.data;
};

/** 임시저장 생성. 같은 유저·타입 조합의 초안이 이미 있으면 백엔드가 409(DRAFT_ALREADY_EXISTS)를 준다 — 그때는 update로 가야 한다. */
export const useDraftCreateMutation = () => {
  return useMutation<
    DraftCreateResponse,
    AppError<DraftCreateRequest>,
    DraftCreateRequest
  >({
    mutationKey: ["post-draft-create"],
    mutationFn: postDraftCreate,
  });
};
