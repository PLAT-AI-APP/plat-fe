import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ResponseLength, Room } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

interface PatchRoomResponseLengthProps {
  roomId: string;
  responseLength: ResponseLength;
}

const patchRoomResponseLength = async ({
  roomId,
  responseLength,
}: PatchRoomResponseLengthProps) => {
  // TODO: 로컬 백엔드 테스트용 임시 하드코딩. 커밋 전에 baseURL 옵션을 지운다.
  await authAxios.patch(
    `/rooms/${roomId}/response-length`,
    { responseLength },
    { baseURL: "http://localhost:8080" },
  );
};

/**
 * 소설형 답변 길이(짧게·보통·길게) 변경. 소설형이 아닌 방은 서버가 400 으로 거절한다.
 * 다음 턴부터 서버가 이 방의 길이로 분량·출력 상한을 정하고, 진행 중인 턴에는 영향이 없다.
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
    onMutate: async ({ roomId, responseLength }) => {
      const queryKey = roomQueryKeys.detail(roomId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Room>(queryKey);
      if (previous) {
        queryClient.setQueryData<Room>(queryKey, {
          ...previous,
          responseLength,
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
