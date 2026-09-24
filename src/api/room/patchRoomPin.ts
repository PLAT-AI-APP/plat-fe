import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ThumbnailRoom } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";
import {
  type RoomListSnapshot,
  restoreRoomLists,
  snapshotRoomLists,
  updateRoomLists,
} from "./roomListCache";

const putRoomPin = async (roomId: string) => {
  await authAxios.put(`/rooms/${roomId}/pin`);
};

const deleteRoomPin = async (roomId: string) => {
  await authAxios.delete(`/rooms/${roomId}/pin`);
};

/**
 * 핀 아이콘은 누른 즉시 바뀌어야 해서 목록 캐시를 먼저 고친다. 고정하면 서버처럼 맨 앞으로
 * 올려 두고, 정확한 순서는 끝난 뒤 뒤에서 다시 받아 맞춘다(화면은 그대로 둔 채 교체된다).
 */
const useRoomPinMutation = (
  mutationKey: string,
  mutationFn: (roomId: string) => Promise<void>,
  isPinned: boolean,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string, RoomListSnapshot>({
    mutationKey: [mutationKey],
    mutationFn,
    onMutate: async (roomId) => {
      const snapshot = await snapshotRoomLists(queryClient);

      let target: ThumbnailRoom | undefined;
      updateRoomLists(queryClient, (rooms) =>
        rooms.flatMap((room) => {
          if (room.roomId !== roomId) return [room];
          target = { ...room, isPinned };
          // 고정은 첫 쪽 맨 앞으로 옮기므로 제자리에서는 뺀다.
          return isPinned ? [] : [target];
        }),
      );
      if (isPinned && target) {
        const pinned = target;
        updateRoomLists(queryClient, (rooms, pageIndex) =>
          pageIndex === 0 ? [pinned, ...rooms] : rooms,
        );
      }

      return snapshot;
    },
    onError: (_error, _roomId, snapshot) => {
      restoreRoomLists(queryClient, snapshot);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
    },
  });
};

/** 채팅방 고정. 고정 채팅방은 목록 조회 시 서버가 알아서 맨 앞으로 정렬해 준다. */
export const usePinRoomMutation = () =>
  useRoomPinMutation("put-room-pin", putRoomPin, true);

/** 채팅방 고정 해제 */
export const useUnpinRoomMutation = () =>
  useRoomPinMutation("delete-room-pin", deleteRoomPin, false);
