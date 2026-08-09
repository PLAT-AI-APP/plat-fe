import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError, PageResponse } from "@/type/api";

export interface GetFollowingListResponse {
  userId: string;
  profileImage: string | null;
  nickname: string;
  description: string;
}

interface GetFollowingListProps {
  pageParam: number;
}

export const getFollowingList = async ({
  pageParam = 0,
}: GetFollowingListProps) => {
  const response = await authAxios.get<PageResponse<GetFollowingListResponse>>(
    `/follow/following`,
    {
      params: {
        page: pageParam,
      },
    },
  );

  return response.data;
};

/** 사용자의 팔로잉 목록 조회 */
export const useFollowingListQuery = (enabled: boolean) => {
  return useInfiniteQuery<PageResponse<GetFollowingListResponse>, AppError>({
    queryKey: ["get-following-list"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getFollowingList({ pageParam: pageParam as number }),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? null : lastPage.number + 1;
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
