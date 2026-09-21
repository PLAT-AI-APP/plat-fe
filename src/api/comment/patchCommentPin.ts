import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { commentQueryKeys } from "./queryKeys";

interface PatchCommentPinProps {
  universeId: string;
  commentId: string;
}

const patchCommentPin = async ({ universeId, commentId }: PatchCommentPinProps) => {
  await authAxios.patch(`/comment/universe/${universeId}/pinned`, {
    commentId,
  });
};

/** 댓글 고정. 세계관 제작자만 가능하고, 루트 댓글만 고정할 수 있다. */
export const usePatchCommentPinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchCommentPinProps>({
    mutationKey: ["patch-comment-pin"],
    mutationFn: patchCommentPin,
    onSuccess: (_, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.universeComments(universeId),
      });
    },
  });
};
