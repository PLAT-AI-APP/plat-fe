import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { FollowPageResponse, normalizeFollowPage } from "./followPage";

interface GetFollowingListProps {
  pageParam: number;
}

export const getFollowingList = async ({
  pageParam = 0,
}: GetFollowingListProps) => {
  const response = await authAxios.get<FollowPageResponse>(
    `/follow/following`,
    {
      params: {
        page: pageParam,
      },
    },
  );

  return normalizeFollowPage(response.data);
};

/** 사용자의 팔로잉 목록 조회 */
export const useFollowingListQuery = (enabled: boolean) => {
  return useInfiniteQuery<ReturnType<typeof normalizeFollowPage>, AppError>({
    queryKey: ["get-following-list"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getFollowingList({ pageParam: pageParam as number }),
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
