import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

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
  const response = await authAxios.get<GetHashtagListResponse>(`/hashtag/list`, {
    params: {
      lang: "KO",
    },
  });

  return response.data;
};

/** 해시태그 목록 조회 */
export const useHashtagListQuery = (enabled = true) => {
  return useQuery<GetHashtagListResponse, AppError>({
    queryKey: ["get-hashtag-list"],
    queryFn: getHashtagList,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
