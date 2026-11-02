import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios, notifyApiError } from "..";
import { getApiErrorMessage } from "@/lib/apiError";
import { showAppToast } from "@/lib/toast";
import { AppError } from "@/type/api";
import { roomQueryKeys } from "./queryKeys";

/** 답을 만들거나 정산하는 중이라 지금은 고칠 수 없을 때 서버가 주는 코드(409). */
const CHAT_ROOM_BUSY_CODE = "CHAT_ROOM_BUSY";

interface PatchRoomMemoryEntryProps {
  roomId: string;
  /** 목록 항목의 id(요약 경계 메시지 id) */
  memoryId: string;
  /** 공백만으로는 안 되고, 최대 4000자 */
  content: string;
}

const patchRoomMemoryEntry = async ({
  roomId,
  memoryId,
  content,
}: PatchRoomMemoryEntryProps) => {
  await authAxios.patch(`/rooms/${roomId}/memory/${memoryId}`, { content });
};

/**
 * 지나온 대화 항목 수정. 서버가 그 뒤 요약을 지우고 이후 대화로 다시 만들어,
 * 성공 뒤 목록을 다시 받아야 한다(다시 만드는 동안 뒤 항목이 줄어 있을 수 있다).
 * 409 는 잠시 뒤 풀리는 상태라 다시 시도하라고 안내한다.
 */
export const usePatchRoomMemoryEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchRoomMemoryEntryProps>({
    mutationKey: ["patch-room-memory-entry"],
    mutationFn: patchRoomMemoryEntry,
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
      // 방 상세에 실린 기억도 서버가 같이 바꾼다.
      void queryClient.invalidateQueries({
        queryKey: roomQueryKeys.detail(roomId),
      });
    },
  });
};
