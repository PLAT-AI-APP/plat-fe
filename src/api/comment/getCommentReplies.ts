import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, SliceWith } from "@/type/api";
import type { Comment } from "@/type/comment";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";

export const commentRepliesQueryKey = (commentId?: string) => [
  "get-comment-replies",
  commentId,
];

const getCommentReplies = async (
  commentId: string,
  page: number,
  authenticated: boolean,
) => {
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<SliceWith<Comment>>(
    `/comment/${commentId}/replies`,
    { params: { page } },
  );

  return response.data;
};

/** 답글 목록 조회. 펼쳤을 때만 호출되도록 enabled로 제어합니다. */
export const useCommentRepliesInfiniteQuery = (
  commentId?: string,
  enabled = true,
) => {
  const authenticated = useAuthReady();

  return useInfiniteQuery<SliceWith<Comment>, AppError>({
    queryKey: [...commentRepliesQueryKey(commentId), authenticated],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getCommentReplies(commentId ?? "", pageParam as number, authenticated),
    getNextPageParam: getNextPageNumber,
    staleTime: 1000 * 60,
    enabled: Boolean(commentId) && enabled,
  });
};
