import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { commentQueryKeys } from "./queryKeys";

interface PostUniverseCommentProps {
  universeId: string;
  /** 최대 1000자. 공백만으로는 보낼 수 없습니다. */
  content: string;
}

const postUniverseComment = async ({
  universeId,
  content,
}: PostUniverseCommentProps) => {
  await authAxios.post(`/comment/universe/${universeId}`, { content });
};

/** 세계관 댓글 작성 */
export const usePostUniverseCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PostUniverseCommentProps>({
    mutationKey: ["post-universe-comment"],
    mutationFn: postUniverseComment,
    onSuccess: (_, { universeId }) => {
      // 등록 직후 화면 동작이 갱신된 댓글 목록을 기준으로 이어지도록 재조회를 기다립니다.
      return queryClient.invalidateQueries({
        queryKey: commentQueryKeys.universeComments(universeId),
      });
    },
  });
};
