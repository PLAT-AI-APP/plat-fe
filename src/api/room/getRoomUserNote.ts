import { queryOptions, useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { roomQueryKeys } from "./queryKeys";

interface RoomUserNoteResponse {
  /** 쓴 적이 없으면 빈 문자열이다. */
  userNote: string;
}

const getRoomUserNote = async (roomId: string) => {
  const response = await authAxios.get<RoomUserNoteResponse>(
    `/rooms/${roomId}/note`,
  );

  return response.data.userNote;
};

/**
 * 채팅방 유저노트. 방 상세에도 같은 값이 실려 오지만, 사이드바를 열 때는 이 API 로 지금 값을 다시 받는다 —
 * 방 상세는 캐시를 오래 두는 데다, 다른 기기에서 고친 노트가 그대로 덮이면 안 된다.
 */
export const roomUserNoteQueryOptions = (roomId?: string) =>
  queryOptions<string, AppError>({
    queryKey: roomQueryKeys.userNote(roomId),
    queryFn: () => getRoomUserNote(roomId ?? ""),
    enabled: Boolean(roomId),
  });

export const useRoomUserNoteQuery = (roomId?: string) =>
  useQuery(roomUserNoteQueryOptions(roomId));
