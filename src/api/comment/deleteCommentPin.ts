import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { universeCommentsQueryKey } from "./getUniverseComments";

interface DeleteCommentPinProps {
  universeId: string;
}

const deleteCommentPin = async ({ universeId }: DeleteCommentPinProps) => {
  await authAxios.delete(`/comment/universe/${universeId}/pinned`);
};

/** 댓글 고정 해제. 세계관 제작자만 가능하다. */
export const useDeleteCommentPinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, DeleteCommentPinProps>({
    mutationKey: ["delete-comment-pin"],
    mutationFn: deleteCommentPin,
    onSuccess: (_, { universeId }) => {
      queryClient.invalidateQueries({
        queryKey: universeCommentsQueryKey(universeId),
      });
    },
  });
};
