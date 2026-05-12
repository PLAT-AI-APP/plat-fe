import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError, PageResponse } from "@/type/api";

export interface GetFollowerListResponse {
  userId: number;
  profileImage: string | null;
  nickname: string;
}

interface GetFollowerListProps {
  pageParam: number;
}
const getFollowerList = async ({
  pageParam = 0,
  //   size = 20,
}: GetFollowerListProps) => {
  const response = await authAxios.get<
    ApiSuccessResponse<PageResponse<GetFollowerListResponse>>
  >(`/follow/followers`, {
    params: {
      page: pageParam,
    },
  });

  return response.data.data;
};

/** 사용자의 팔로워 목록 조회 */
export const useFollowerListQuery = (enabled: boolean) => {
  return useInfiniteQuery<PageResponse<GetFollowerListResponse>, AppError>({
    queryKey: ["get-follower-list"],
    initialPageParam: 0,

    // pageParam을 가져와서 page라는 이름으로 별칭(Alias) 지정
    queryFn: ({ pageParam }) =>
      getFollowerList({ pageParam: pageParam as number }),

    getNextPageParam: (lastPage) => {
      return lastPage.last ? null : lastPage.number + 1;
    },
    staleTime: 1000 * 60 * 5,
    enabled: enabled,
  });
};
