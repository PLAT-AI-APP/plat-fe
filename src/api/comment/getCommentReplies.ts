import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, SliceWith } from "@/type/api";
import type { Comment } from "@/type/comment";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";
import { commentQueryKeys } from "./queryKeys";

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
  const isAuthChecked = useAuthStore((state) => state.isAuthReady);

  return useInfiniteQuery<SliceWith<Comment>, AppError>({
    queryKey: [...commentQueryKeys.replies(commentId), authenticated],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getCommentReplies(commentId ?? "", pageParam as number, authenticated),
    getNextPageParam: getNextPageNumber,
    staleTime: 1000 * 60,
    // 인증 확인 전에 먼저 받으면, 확인이 끝나 키가 바뀔 때 처음부터 다시 로딩한다.
    enabled: Boolean(commentId) && enabled && isAuthChecked,
  });
};
