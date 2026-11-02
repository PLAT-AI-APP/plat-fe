"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ReviewFinding, ReviewImage } from "@/type/card";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { reviewQueryKeys } from "./queryKeys";

export interface ContentReviewResponse {
  taskId: string | null;
  /** 본문과 이미지를 합친 상태. 본문 반려나 이미지 반려·성인 설정 필요가 하나라도 있으면 REJECTED */
  reviewStatus: "APPROVED" | "PENDING" | "REJECTED";
  jobStatus: string | null;
  scope: string | null;
  /** 본문 사유. 이미지 사유는 images 에 있다. */
  reasonCode: string | null;
  reason: string | null;
  findings: ReviewFinding[];
  images: ReviewImage[];
}

const getUniverseReview = async (universeId: string) => {
  const response = await authAxios.get<ContentReviewResponse>(
    `/content-reviews/UNIVERSE/${universeId}`,
  );

  return response.data;
};

/** 수정 화면에서 내 세계관의 검수 상태. 반려된 이미지 칸을 표시하는 데 쓴다. */
export const useUniverseReviewQuery = (universeId?: string) => {
  const authReady = useAuthReady();

  return useQuery<ContentReviewResponse, AppError>({
    queryKey: reviewQueryKeys.universe(universeId),
    queryFn: () => getUniverseReview(universeId ?? ""),
    enabled: Boolean(universeId) && authReady,
    // 저장하면 이미지가 바뀌므로, 다시 들어왔을 때 지난 표시가 잠깐이라도 보이지 않게 캐시를 남기지 않는다.
    gcTime: 0,
  });
};
