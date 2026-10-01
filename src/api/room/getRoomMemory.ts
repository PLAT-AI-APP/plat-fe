import { queryOptions, useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { roomQueryKeys } from "./queryKeys";

interface RoomMemoryResponse {
  /** 쓴 적이 없으면 빈 문자열이다. */
  memory: string;
}

const getRoomMemory = async (roomId: string) => {
  const response = await authAxios.get<RoomMemoryResponse>(
    `/rooms/${roomId}/memory`,
  );

  return response.data.memory;
};

/**
 * 채팅방 지나온 대화(장기기억).
 *
 * 턴이 끝날 때마다 서버가 요약으로 덮어쓰므로, 방 상세에 실려 온 값을 쓰면 대화를 이어간 뒤
 * 옛 요약이 보인다. 화면을 열 때마다 새로 받도록 오래된 것으로 두고(staleTime 0) 따로 조회한다.
 */
export const roomMemoryQueryOptions = (roomId?: string) =>
  queryOptions<string, AppError>({
    queryKey: roomQueryKeys.memory(roomId),
    queryFn: () => getRoomMemory(roomId ?? ""),
    staleTime: 0,
    enabled: Boolean(roomId),
  });

export const useRoomMemoryQuery = (roomId?: string) =>
  useQuery(roomMemoryQueryOptions(roomId));
