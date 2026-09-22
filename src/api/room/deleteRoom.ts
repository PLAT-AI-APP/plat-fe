import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { roomQueryKeys } from "./queryKeys";
import {
  type RoomListSnapshot,
  restoreRoomLists,
  snapshotRoomLists,
  updateRoomLists,
} from "./roomListCache";

const deleteRoom = async (roomId: string) => {
  await authAxios.delete(`/rooms/${roomId}`);
};

/**
 * 채팅방 삭제. 확인 창이 닫히는 순간 목록에서도 빠지도록 먼저 빼고, 실패하면 되돌린다.
 * 예전에는 요청과 목록 재조회가 끝날 때까지 지운 방이 남아 있었다.
 */
export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string, RoomListSnapshot>({
    mutationKey: ["delete-room"],
    mutationFn: deleteRoom,
    onMutate: async (roomId) => {
      const snapshot = await snapshotRoomLists(queryClient);
      updateRoomLists(queryClient, (rooms) =>
        rooms.filter((room) => room.roomId !== roomId),
      );
      return snapshot;
    },
    onError: (_error, _roomId, snapshot) => {
      restoreRoomLists(queryClient, snapshot);
    },
    onSuccess: (_, roomId) => {
      queryClient.removeQueries({ queryKey: roomQueryKeys.detail(roomId) });
      // 쪽 경계가 한 칸 당겨지므로 뒤에서 다시 맞춘다.
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
    },
  });
};
