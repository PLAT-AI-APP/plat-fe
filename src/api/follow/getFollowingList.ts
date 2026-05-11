import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

export interface FollowingUser {
  userId: number;
  profileImage: string | null;
  nickname: string;
}

export interface GetFollowingListResponse {
  content: FollowingUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

interface GetFollowingListProps {
  // userId: string;
  pageParam: number;
}
const getFollowingList = async ({
  // userId,
  pageParam = 0,
  //   size = 20,
}: GetFollowingListProps) => {
  const response = await authAxios.get<
    ApiSuccessResponse<GetFollowingListResponse>
  >(`/follow/following`, {
    params: {
      page: pageParam,
    }, // Query String 처리
  });

  return response.data.data;
};

/** 사용자의 팔로잉 목록 조회 */
export const useFollowingListQuery = (enabled: boolean) => {
  return useInfiniteQuery<GetFollowingListResponse, AppError>({
    queryKey: ["get-following-list"],
    initialPageParam: 0,

    // pageParam을 가져와서 page라는 이름으로 별칭(Alias) 지정
    queryFn: ({ pageParam }) =>
      getFollowingList({ pageParam: pageParam as number }),

    getNextPageParam: (lastPage) => {
      return lastPage.last ? null : lastPage.number + 1;
    },
    staleTime: 1000 * 60 * 5,
    enabled: enabled,
  });
};
