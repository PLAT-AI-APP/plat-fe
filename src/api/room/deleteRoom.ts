import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { ROOM_LIST_QUERY_KEY } from "./getRoomList";
import { roomDetailQueryKey } from "./getRoomDetail";

const deleteRoom = async (roomId: string) => {
  await authAxios.delete(`/rooms/${roomId}`);
};

/** 채팅방 삭제 */
export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: ["delete-room"],
    mutationFn: deleteRoom,
    onSuccess: (_, roomId) => {
      queryClient.removeQueries({ queryKey: roomDetailQueryKey(roomId) });
      queryClient.invalidateQueries({ queryKey: ROOM_LIST_QUERY_KEY });
    },
  });
};
