import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { ROOM_LIST_QUERY_KEY } from "./getRoomList";

const putRoomPin = async (roomId: string) => {
  await authAxios.put(`/rooms/${roomId}/pin`);
};

const deleteRoomPin = async (roomId: string) => {
  await authAxios.delete(`/rooms/${roomId}/pin`);
};

/** 채팅방 고정. 고정 채팅방은 목록 조회 시 서버가 알아서 맨 앞으로 정렬해 준다. */
export const usePinRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: ["put-room-pin"],
    mutationFn: putRoomPin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_LIST_QUERY_KEY });
    },
  });
};

/** 채팅방 고정 해제 */
export const useUnpinRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: ["delete-room-pin"],
    mutationFn: deleteRoomPin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_LIST_QUERY_KEY });
    },
  });
};
