import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ChatResponseLength } from "@/type/chat";
import type { PromptMultiplier, Room } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

interface PatchRoomResponseLengthProps {
  roomId: string;
  responseLength: ChatResponseLength;
  /** 낙관적 갱신용. 서버의 길이별 배수(카탈로그의 creditMultiplier)다. */
  multiplier: PromptMultiplier;
}

const patchRoomResponseLength = async ({
  roomId,
  responseLength,
}: PatchRoomResponseLengthProps) => {
  await authAxios.patch(`/rooms/${roomId}/response-length`, { responseLength });
};

/**
 * 채팅방 답변 길이 수정. 서버가 생성·요금 모두 방에 저장된 이 값을 쓴다.
 * 누르자마자 바뀌어 보이도록 방 응답을 먼저 고치고, 실패하면 되돌린다.
 */
export const usePatchRoomResponseLengthMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AppError,
    PatchRoomResponseLengthProps,
    { previous?: Room }
  >({
    mutationKey: ["patch-room-response-length"],
    mutationFn: patchRoomResponseLength,
    onMutate: async ({ roomId, responseLength, multiplier }) => {
      const queryKey = roomQueryKeys.detail(roomId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Room>(queryKey);
      if (previous) {
        queryClient.setQueryData<Room>(queryKey, {
          ...previous,
          responseLength,
          multiplier,
        });
      }

      return { previous };
    },
    onError: (_error, { roomId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          roomQueryKeys.detail(roomId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _error, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) });
    },
  });
};
