"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { DraftType } from "./postDraftCreate";

export interface DraftCurrentResponse {
  draftId: string;
}

/** 유저·타입 조합당 초안은 최대 1개라, 있으면 그 하나가 곧 "현재 초안"이다. 없으면 백엔드가 204를 준다. */
const getDraftCurrent = async (type: DraftType) => {
  const response = await authAxios.get<DraftCurrentResponse | "">(
    "/drafts/current",
    { params: { type } },
  );

  return response.data || null;
};

/** 저장/불러오기 버튼이 create로 갈지 update로 갈지, 불러올 대상이 있는지 판단하는 데 씁니다. */
export const useDraftCurrentQuery = (type: DraftType, enabled = true) => {
  return useQuery<DraftCurrentResponse | null, AppError>({
    queryKey: ["get-draft-current", type],
    queryFn: () => getDraftCurrent(type),
    enabled,
    staleTime: 0,
  });
};
