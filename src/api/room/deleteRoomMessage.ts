import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios, notifyApiError } from "..";
import { getApiErrorMessage } from "@/lib/apiError";
import { showAppToast } from "@/lib/toast";
import { AppError } from "@/type/api";
import { removeRoomMessagesFromCache } from "./getRoomMessages";
import { roomQueryKeys } from "./queryKeys";

/** 정산이 끝나지 않은 턴이 있어 지금은 지울 수 없을 때 서버가 주는 코드(409). */
const CHAT_ROOM_BUSY_CODE = "CHAT_ROOM_BUSY";

interface DeleteRoomMessageParams {
  roomId: string;
  /** 턴의 사용자 메시지나 AI 답 어느 쪽 id 든 된다. 서버가 그 턴의 사용자 메시지부터 뒤를 모두 지운다. */
  messageId: string;
}

interface DeleteRoomMessageResponse {
  /** 지운 메시지 id(오래된 순). 그 턴과 뒤의 대화 전부다. */
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
 * 턴(내 말 + 캐릭터 답)과 그 뒤 대화 삭제. 지나온 대화(장기기억)도 서버가 그 턴 이전으로 되돌린다.
 *
 * 시나리오 첫 메시지는 400, 답을 만들거나 정산하는 중이면 409(CHAT_ROOM_BUSY) 다.
 * 409 는 잠시 뒤 풀리는 상태라 다시 시도하라고 안내하고, 나머지 실패는 서버 문구로 알린다.
 * 쓴 노트는 돌려주지 않고, 에셋 해금도 되돌리지 않는다(해금은 캐릭터에 남는다).
 */
export const useDeleteRoomMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRoomMessageResponse, AppError, DeleteRoomMessageParams>({
    mutationKey: ["delete-room-message"],
    mutationFn: deleteRoomMessage,
    // 실패 안내는 onError 가 직접 한다. 전역 토스트까지 뜨면 두 번 말한다.
    meta: { silent: true },
    onError: (error) => {
      if (error.code === CHAT_ROOM_BUSY_CODE) {
        showAppToast("info", getApiErrorMessage("chatRoomBusy"));
        return;
      }
      notifyApiError(error);
    },
    onSuccess: ({ deletedMessageIds }, { roomId }) => {
      removeRoomMessagesFromCache(queryClient, roomId, deletedMessageIds);
      // 지나온 대화가 되돌아갔다.
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) });
      // 목록의 마지막 메시지 미리보기가 바뀔 수 있다.
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
    },
  });
};
