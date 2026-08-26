"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";

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
  page?: number;
  size?: number;
}

const getAssetPreview = async ({
  page = 0,
  size = 10,
}: GetAssetPreviewParams) => {
  const response = await authAxios.get<AssetPreviewItem[]>(
    "/home/asset-preview",
    {
      params: {
        page,
        size,
      },
    },
  );

  return response.data;
};

/** 홈 화면 상황 에셋이 많은 캐릭터 미리보기 목록 조회 */
export const useAssetPreviewQuery = (params: GetAssetPreviewParams = {}) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);

  return useQuery<AssetPreviewItem[], AppError>({
    queryKey: ["get-asset-preview", locale, params.page, params.size],
    queryFn: () => getAssetPreview(params),
    staleTime: 1000 * 60 * 5,
  });
};
