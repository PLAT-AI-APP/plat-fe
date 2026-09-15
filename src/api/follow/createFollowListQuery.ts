import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { getNextPageNumber } from "@/lib/pagination";
import { FollowPageResponse, normalizeFollowPage } from "./followPage";

/**
 * 팔로워/팔로잉 목록 조회 훅 팩토리.
 * 엔드포인트와 캐시 키만 다르고 나머지 조회 로직은 완전히 같습니다.
 */
export const createFollowListQuery = (
  endpoint: "followers" | "following",
  queryKey: readonly unknown[],
) => {
  const getFollowList = async (pageParam: number) => {
    const response = await authAxios.get<FollowPageResponse>(
      `/follow/${endpoint}`,
      { params: { page: pageParam } },
    );

    return normalizeFollowPage(response.data);
  };

  return (enabled: boolean) =>
    useInfiniteQuery<ReturnType<typeof normalizeFollowPage>, AppError>({
      queryKey,
      initialPageParam: 0,
      queryFn: ({ pageParam }) => getFollowList(pageParam as number),
      getNextPageParam: getNextPageNumber,
      enabled,
    });
};
