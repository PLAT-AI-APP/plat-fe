import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { Room } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

interface PatchRoomAnswerRecommendationProps {
  roomId: string;
  enabled: boolean;
}

const patchRoomAnswerRecommendation = async ({
  roomId,
  enabled,
}: PatchRoomAnswerRecommendationProps) => {
  await authAxios.patch(`/rooms/${roomId}/answer-recommendation`, { enabled });
};

/**
 * 답변 추천 사용 여부. 켜 두면 다음 턴부터 응답 끝에 추천 문장이 함께 온다.
 *
 * 스위치는 누르는 즉시 움직여야 해서 방 상세 캐시를 먼저 바꾸고, 실패하면 되돌린다.
 */
export const usePatchRoomAnswerRecommendationMutation = () => {
  const queryClient = useQueryClient();

  const setEnabled = (roomId: string, enabled: boolean) => {
    queryClient.setQueryData<Room>(roomQueryKeys.detail(roomId), (previous) =>
      previous ? { ...previous, answerRecommendationEnabled: enabled } : previous,
    );
  };

  return useMutation<void, AppError, PatchRoomAnswerRecommendationProps>({
    mutationKey: ["patch-room-answer-recommendation"],
    mutationFn: patchRoomAnswerRecommendation,
    onMutate: ({ roomId, enabled }) => {
      setEnabled(roomId, enabled);
      return { previousEnabled: !enabled };
    },
    onError: (_error, { roomId, enabled }) => {
      setEnabled(roomId, !enabled);
    },
  });
};
