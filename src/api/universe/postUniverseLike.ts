"use client";

import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { rankingQueryKeys } from "@/api/ranking/queryKeys";
import { userQueryKeys } from "@/api/user/queryKeys";
import type { UniverseDetailResponse } from "./getUniverseDetail";
import { universeQueryKeys } from "./queryKeys";

interface UniverseLikeProps {
  universeId: string;
}

/** 멱등입니다. 이미 찜한 세계관을 다시 눌러도 204로 돌아옵니다. */
const postUniverseLike = async ({ universeId }: UniverseLikeProps) => {
  await authAxios.post(`/universe/${universeId}/like`);
};

const deleteUniverseLike = async ({ universeId }: UniverseLikeProps) => {
  await authAxios.delete(`/universe/${universeId}/like`);
};

interface LikeSnapshot {
  previous: [QueryKey, UniverseDetailResponse | undefined][];
}

/**
 * 하트는 누른 즉시 반응해야 해서 응답을 기다리지 않고 먼저 칠합니다.
 * 실패하면 onError가 찍어 둔 값으로 되돌리고, 성공·실패 모두 마지막에 서버 값을 다시 받아 맞춥니다.
 *
 * 상세 쿼리 키는 `[...detail(id), authReady]` 처럼 뒤에 로그인 여부가 붙는다. 그래서
 * 정확히 일치해야 찾는 getQueryData/setQueryData 로는 캐시를 못 찾아 낙관적 값이 들어가지
 * 않았다 — 앞부분 일치로 찾는 getQueriesData/setQueriesData 를 쓴다.
 */
const useUniverseLikeMutation = (
  mutationKey: string,
  mutationFn: (props: UniverseLikeProps) => Promise<void>,
  liked: boolean,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, UniverseLikeProps, LikeSnapshot>({
    mutationKey: [mutationKey],
    mutationFn,
    onMutate: async ({ universeId }) => {
      const queryKey = universeQueryKeys.detail(universeId);
      // 진행 중인 조회가 끝나면서 낙관적 값을 덮어쓰지 않도록 먼저 멈춥니다.
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueriesData<UniverseDetailResponse>({
        queryKey,
      });
      queryClient.setQueriesData<UniverseDetailResponse>(
        { queryKey },
        (current) =>
          current && {
            ...current,
            liked,
            // 이미 그 상태면 서버도 카운트를 건드리지 않으므로 여기서도 그대로 둡니다.
            likeCount:
              current.liked === liked
                ? current.likeCount
                : Math.max(current.likeCount + (liked ? 1 : -1), 0),
          },
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: (_data, _error, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: universeQueryKeys.detail(universeId),
      });
      // 찜 수·찜 여부가 실린 목록들도 다시 받습니다.
      queryClient.invalidateQueries({ queryKey: rankingQueryKeys.all() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.likedUniverses() });
    },
  });
};

/** 세계관 찜 */
export const usePostUniverseLikeMutation = () =>
  useUniverseLikeMutation("post-universe-like", postUniverseLike, true);

/** 세계관 찜 취소 */
export const useDeleteUniverseLikeMutation = () =>
  useUniverseLikeMutation("delete-universe-like", deleteUniverseLike, false);
