import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { removeRoomMessagesFromCache } from "./getRoomMessages";
import { roomQueryKeys } from "./queryKeys";

interface DeleteRoomMessageParams {
  roomId: string;
  /** 턴의 사용자 메시지나 AI 답 어느 쪽 id 든 된다. 서버가 짝을 찾아 턴을 통째로 지운다. */
  messageId: string;
}

interface DeleteRoomMessageResponse {
  /** 지운 메시지 id(오래된 순). 보통 사용자 메시지와 AI 답 두 개다. */
  deletedMessageIds: string[];
}

const deleteRoomMessage = async ({
  roomId,
  messageId,
}: DeleteRoomMessageParams) => {
  const response = await authAxios.delete<DeleteRoomMessageResponse>(
    `/rooms/${roomId}/messages/${messageId}`,
  );

  return response.data;
};

/**
 * 턴(내 말 + 캐릭터 답) 삭제.
 *
 * 시나리오 첫 메시지는 400, 답을 만드는 중이면 409 다 — 실패 안내는 전역 토스트가 서버 문구로 한다.
 * 쓴 노트는 돌려주지 않고, 에셋 해금도 되돌리지 않는다.
 */
export const useDeleteRoomMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRoomMessageResponse, AppError, DeleteRoomMessageParams>({
    mutationKey: ["delete-room-message"],
    mutationFn: deleteRoomMessage,
    onSuccess: ({ deletedMessageIds }, { roomId }) => {
      removeRoomMessagesFromCache(queryClient, roomId, deletedMessageIds);
      // 목록의 마지막 메시지 미리보기가 바뀔 수 있다.
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
    },
  });
};
