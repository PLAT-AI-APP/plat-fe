import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { FollowPageResponse, normalizeFollowPage } from "./followPage";
import { followQueryKeys } from "./queryKeys";

interface GetFollowerListProps {
  pageParam: number;
}
const getFollowerList = async ({
  pageParam = 0,
  //   size = 20,
}: GetFollowerListProps) => {
  const response = await authAxios.get<FollowPageResponse>(
    `/follow/followers`,
    {
      params: {
        page: pageParam,
      },
    },
  );

  return normalizeFollowPage(response.data);
};

/** 사용자의 팔로워 목록 조회 */
export const useFollowerListQuery = (enabled: boolean) => {
  return useInfiniteQuery<
    ReturnType<typeof normalizeFollowPage>,
    AppError
  >({
    queryKey: followQueryKeys.followerList(),
    initialPageParam: 0,

    // pageParam을 가져와서 page라는 이름으로 별칭(Alias) 지정
    queryFn: ({ pageParam }) =>
      getFollowerList({ pageParam: pageParam as number }),

    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60 * 5,
    enabled: enabled,
  });
};
