"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { UniverseDetailResponse } from "./getUniverseDetail";

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

const universeDetailQueryKey = (universeId: string) => [
  "get-universe-detail",
  universeId,
];

interface LikeSnapshot {
  previous?: UniverseDetailResponse;
}

/**
 * 하트는 누른 즉시 반응해야 해서 응답을 기다리지 않고 먼저 칠합니다.
 * 실패하면 onError가 찍어 둔 값으로 되돌리고, 성공·실패 모두 마지막에 서버 값을 다시 받아 맞춥니다.
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
      const queryKey = universeDetailQueryKey(universeId);
      // 진행 중인 조회가 끝나면서 낙관적 값을 덮어쓰지 않도록 먼저 멈춥니다.
      await queryClient.cancelQueries({ queryKey });

      const previous =
        queryClient.getQueryData<UniverseDetailResponse>(queryKey);
      if (previous) {
        queryClient.setQueryData<UniverseDetailResponse>(queryKey, {
          ...previous,
          liked,
          // 이미 그 상태면 서버도 카운트를 건드리지 않으므로 여기서도 그대로 둡니다.
          likeCount:
            previous.liked === liked
              ? previous.likeCount
              : Math.max(previous.likeCount + (liked ? 1 : -1), 0),
        });
      }

      return { previous };
    },
    onError: (_error, { universeId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          universeDetailQueryKey(universeId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _error, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: universeDetailQueryKey(universeId),
      });
      // 찜 수·찜 여부가 실린 목록들도 다시 받습니다.
      queryClient.invalidateQueries({ queryKey: ["get-ranking"] });
      queryClient.invalidateQueries({ queryKey: ["get-liked-universes"] });
    },
  });
};

/** 세계관 찜 */
export const usePostUniverseLikeMutation = () =>
  useUniverseLikeMutation("post-universe-like", postUniverseLike, true);

/** 세계관 찜 취소 */
export const useDeleteUniverseLikeMutation = () =>
  useUniverseLikeMutation("delete-universe-like", deleteUniverseLike, false);
