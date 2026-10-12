import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { Room } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

interface PatchRoomResponseFormatProps {
  roomId: string;
  /** Room.allowedResponseFormats[].code 중 하나 */
  responseFormat: string;
}

const patchRoomResponseFormat = async ({ roomId, responseFormat }: PatchRoomResponseFormatProps) => {
  await authAxios.patch(`/rooms/${roomId}/response-format`, { responseFormat });
};

/**
 * 채팅방 응답 형식 변경. 서버가 다음 턴부터 분량·출력 상한·최근 대화 수에 이 형식을 쓰고, 요금도 형식에 따라 달라진다.
 * 누르자마자 바뀌어 보이도록 방 응답을 먼저 고치고, 실패하면 되돌린다.
 */
export const usePatchRoomResponseFormatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchRoomResponseFormatProps, { previous?: Room }>({
    mutationKey: ["patch-room-response-format"],
    mutationFn: patchRoomResponseFormat,
    onMutate: async ({ roomId, responseFormat }) => {
      const queryKey = roomQueryKeys.detail(roomId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Room>(queryKey);
      if (previous) {
        queryClient.setQueryData<Room>(queryKey, { ...previous, responseFormatCode: responseFormat });
      }

      return { previous };
    },
    onError: (_error, { roomId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(roomQueryKeys.detail(roomId), context.previous);
      }
    },
    onSettled: (_data, _error, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) });
    },
  });
};
