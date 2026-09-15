"use client";

import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { DraftType } from "./postDraftCreate";

export interface DraftResponse {
  draftId: string;
  type: DraftType;
  title: string;
  payload: Record<string, unknown>;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export const getDraft = async (draftId: string) => {
  const response = await authAxios.get<DraftResponse>(`/drafts/${draftId}`);

  return response.data;
};

/** "불러오기" 버튼을 눌렀을 때 그 순간 한 번만 부르면 되는 조회라, 캐시를 두는 useQuery 대신 mutation으로 감싸 mutateAsync로 부릅니다. */
export const useDraftMutation = () => {
  return useMutation<DraftResponse, AppError, string>({
    mutationKey: ["get-draft"],
    mutationFn: getDraft,
  });
};
