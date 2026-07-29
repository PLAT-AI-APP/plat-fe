import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";

export interface GetFollowCountResponse {
  followerCount: number;
  followingCount: number;
}

const DEFAULT_FOLLOW_COUNT = {
  followerCount: 0,
  followingCount: 0,
};

const getFollowCount = async (userId: string) => {
  const response = await axiosInstance.get<
    ApiSuccessResponse<GetFollowCountResponse>
  >(`/follow/${userId}/count`);

  return response.data.data ?? DEFAULT_FOLLOW_COUNT;
};

/** 팔로워/팔로잉 수 조회 */
export const useFollowCountQuery = (userId: string) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery<GetFollowCountResponse, AppError>({
    queryKey: ["get-follow-count", userId],
    queryFn: () => getFollowCount(userId),
    staleTime: 1000 * 60 * 5,
    enabled: isLoggedIn && !!userId,
  });
};
