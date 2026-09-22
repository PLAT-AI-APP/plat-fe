import { queryOptions, useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { Room } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

const getRoomDetail = async (roomId: string) => {
  const response = await authAxios.get<Room>(`/rooms/${roomId}`);

  return response.data;
};

/** 조회 훅과 미리 받기(prefetch)가 같은 키·요청을 쓰도록 한곳에서 만든다. */
export const roomDetailQueryOptions = (roomId?: string) =>
  queryOptions<Room, AppError>({
    queryKey: roomQueryKeys.detail(roomId),
    queryFn: () => getRoomDetail(roomId ?? ""),
    staleTime: 1000 * 60,
    enabled: Boolean(roomId),
  });

/** 채팅방 단건 조회 */
export const useRoomDetailQuery = (roomId?: string) =>
  useQuery(roomDetailQueryOptions(roomId));
