"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

export interface AssetPreviewItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  isNew: boolean;
  isOfficial: boolean;
  // 채팅수 뱃지 노출용. 백엔드 응답에 추후 추가될 예정이라 우선 옵셔널로 선언.
  chatCount?: number;
}

interface GetAssetPreviewParams {
  tendency?: Tendency;
}

const getAssetPreview = async ({
  tendency = "ALL",
}: GetAssetPreviewParams) => {
  const response = await authAxios.get<AssetPreviewItem[]>(
    "/home/asset-preview",
    { params: { tendency } },
  );

  return response.data;
};

/** 홈 미리보기 섹션. 실시간(오늘 0시~현재) 대화량 상위 3편이라 페이지가 없습니다. */
export const useAssetPreviewQuery = (params: GetAssetPreviewParams = {}) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);

  return useQuery<AssetPreviewItem[], AppError>({
    queryKey: ["get-asset-preview", locale, tendency],
    // 실시간 랭킹이 1분마다 갱신되므로 그보다 짧게 잡을 이유가 없습니다.
    staleTime: 1000 * 60,
    queryFn: () => getAssetPreview({ ...params, tendency }),
  });
};
