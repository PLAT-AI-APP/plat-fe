"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

export interface NewWorkCreator {
  creatorId: string;
  nickname: string;
}

export interface NewWorkItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: NewWorkCreator;
  // 백엔드 NewWorkCard에는 아직 chatCount가 없어 옵셔널로 선언 (CharacterCard가 값 없으면 뱃지 자체를 숨김)
  chatCount?: number;
}

interface GetNewWorkParams {
  tendency?: Tendency;
  page?: number;
  size?: number;
}

const getNewWork = async ({
  page = 0,
  size = 10,
  tendency = "ALL",
}: GetNewWorkParams) => {
  const response = await authAxios.get<NewWorkItem[]>("/home/new-work", {
    params: {
      tendency,
      page,
      size,
    },
  });

  return response.data;
};

/** 홈 화면 신작 목록 조회 */
export const useNewWorkQuery = (params: GetNewWorkParams = {}) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);

  return useQuery<NewWorkItem[], AppError>({
    queryKey: ["get-new-work", locale, tendency, params.page, params.size],
    queryFn: () => getNewWork({ ...params, tendency }),
  });
};
