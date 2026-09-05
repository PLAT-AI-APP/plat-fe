import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";

export type HashtagCategory =
  | "GENRE"
  | "BACKGROUND"
  | "RACE"
  | "CHARACTER"
  | "APPEARANCE"
  | "PERSONALITY"
  | "RELATIONSHIP"
  | "NARRATIVE"
  | "OCCUPATION"
  | "MOOD"
  | "SPECIAL";

export interface Hashtag {
  id: string;
  category: HashtagCategory;
  label: string;
  isAdult: boolean;
}

export interface GetHashtagListResponse {
  lang: string;
  isAdult: boolean;
  tags: Hashtag[];
}

const getHashtagList = async () => {
  const response = await authAxios.get<GetHashtagListResponse>(`/hashtag/list`);

  return response.data;
};

/** 해시태그 목록 조회 */
export const useHashtagListQuery = (enabled = true) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);

  return useQuery<GetHashtagListResponse, AppError>({
    queryKey: ["get-hashtag-list", locale],
    queryFn: getHashtagList,
    enabled,
  });
};
