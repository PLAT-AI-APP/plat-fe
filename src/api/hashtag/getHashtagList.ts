import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

export interface GetHashtagListResponse {
  lang: string;
  isAdult: boolean;
  tags: string[];
}

const getHashtagList = async () => {
  const response = await authAxios.get<
    ApiSuccessResponse<GetHashtagListResponse>
  >(`/hastag/list`, {
    params: {
      lang: "KO",
    },
  });

  return response.data.data;
};

/** 해시태그 목록 조회 */
export const useHashtagListQuery = () => {
  return useQuery<GetHashtagListResponse, AppError>({
    queryKey: ["get-hashtag-list"],
    queryFn: getHashtagList,
    staleTime: 1000 * 60 * 5,
  });
};
