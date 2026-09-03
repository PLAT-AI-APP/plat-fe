import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import type { Comment } from "@/type/comment";
import { useAuthStore } from "@/store/useAuthStore";

export const universeCommentsQueryKey = (universeId?: string) => [
  "get-universe-comments",
  universeId,
];

/** 페이지 크기는 서버가 20으로 고정합니다. */
export const COMMENT_PAGE_SIZE = 20;

const getUniverseComments = async (
  universeId: string,
  page: number,
  authenticated: boolean,
) => {
  // 로그인 상태면 내가 누른 좋아요 여부가 채워져 내려오므로 토큰을 실어 보냅니다.
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<PageWith<Comment>>(
    `/comment/universe/${universeId}`,
    { params: { page } },
  );

  return response.data;
};

/** 세계관 댓글 목록 조회 */
export const useUniverseCommentsInfiniteQuery = (universeId?: string) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const authenticated = isAuthReady && isLoggedIn;

  return useInfiniteQuery<PageWith<Comment>, AppError>({
    queryKey: [...universeCommentsQueryKey(universeId), authenticated],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getUniverseComments(universeId ?? "", pageParam as number, authenticated),
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60,
    enabled: Boolean(universeId),
  });
};
