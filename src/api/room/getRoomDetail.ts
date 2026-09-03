import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { Room } from "@/type/room";

export const roomDetailQueryKey = (roomId?: string) => [
  "get-room-detail",
  roomId,
];

const getRoomDetail = async (roomId: string) => {
  const response = await authAxios.get<Room>(`/rooms/${roomId}`);

  return response.data;
};

/** 채팅방 단건 조회 */
export const useRoomDetailQuery = (roomId?: string) => {
  return useQuery<Room, AppError>({
    queryKey: roomDetailQueryKey(roomId),
    queryFn: () => getRoomDetail(roomId ?? ""),
    staleTime: 1000 * 60,
    enabled: Boolean(roomId),
  });
};
