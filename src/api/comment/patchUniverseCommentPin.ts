import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { universeCommentsQueryKey } from "./getUniverseComments";

interface PinUniverseCommentProps {
  universeId: string;
  /** 고정할 루트 댓글 id. 답글은 고정할 수 없습니다. */
  commentId: string;
}

const patchUniverseCommentPin = async ({
  universeId,
  commentId,
}: PinUniverseCommentProps) => {
  await authAxios.patch(`/comment/universe/${universeId}/pinned`, {
    commentId,
  });
};

const deleteUniverseCommentPin = async (universeId: string) => {
  await authAxios.delete(`/comment/universe/${universeId}/pinned`);
};

/** 세계관 댓글 고정 */
export const usePinUniverseCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PinUniverseCommentProps>({
    mutationKey: ["pin-universe-comment"],
    mutationFn: patchUniverseCommentPin,
    onSuccess: (_, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: universeCommentsQueryKey(universeId),
      });
    },
  });
};

/** 세계관 댓글 고정 해제 */
export const useUnpinUniverseCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: ["unpin-universe-comment"],
    mutationFn: deleteUniverseCommentPin,
    onSuccess: (_, universeId) => {
      queryClient.invalidateQueries({
        queryKey: universeCommentsQueryKey(universeId),
      });
    },
  });
};
