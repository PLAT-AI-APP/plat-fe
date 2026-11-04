import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios, notifyApiError } from "..";
import { getApiErrorMessage } from "@/lib/apiError";
import { showAppToast } from "@/lib/toast";
import { AppError } from "@/type/api";
import { roomQueryKeys } from "./queryKeys";

/** 답을 만들거나 정산하는 중이라 지금은 지울 수 없을 때 서버가 주는 코드(409). */
const CHAT_ROOM_BUSY_CODE = "CHAT_ROOM_BUSY";

interface DeleteRoomMemoryEntryProps {
  roomId: string;
  /** 목록 항목의 id(요약 경계 메시지 id) */
  memoryId: string;
}

const deleteRoomMemoryEntry = async ({
  roomId,
  memoryId,
}: DeleteRoomMemoryEntryProps) => {
  await authAxios.delete(`/rooms/${roomId}/memory/${memoryId}`);
};

/**
 * 지나온 대화 항목 삭제. 서버가 그 시점의 요약을 비우고 이후 대화로 뒤 요약을 다시 만든다.
 * 대화 원문은 남는다. 409 는 잠시 뒤 풀리는 상태라 다시 시도하라고 안내한다.
 */
export const useDeleteRoomMemoryEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, DeleteRoomMemoryEntryProps>({
    mutationKey: ["delete-room-memory-entry"],
    mutationFn: deleteRoomMemoryEntry,
    // 실패 안내는 onError 가 직접 한다. 전역 토스트까지 뜨면 두 번 말한다.
    meta: { silent: true },
    onError: (error) => {
      if (error.code === CHAT_ROOM_BUSY_CODE) {
        showAppToast("info", getApiErrorMessage("chatRoomBusy"));
        return;
      }
      notifyApiError(error);
    },
    onSuccess: (_, { roomId }) => {
      void queryClient.invalidateQueries({
        queryKey: roomQueryKeys.memory(roomId),
      });
      void queryClient.invalidateQueries({
        queryKey: roomQueryKeys.detail(roomId),
      });
    },
  });
};
