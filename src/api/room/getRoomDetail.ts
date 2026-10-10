import { queryOptions, useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { isSignedImageUrl } from "@/lib/file";
import { AppError } from "@/type/api";
import type { Room } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

/**
 * 성인 세계관 방의 이미지 주소는 서명 URL 이라 1~2시간 뒤 만료된다. 메시지 행은 스크롤로 다시 그려질 때 이미지를 다시 받으므로,
 * 오래 켜 둔 방에서도 이미지가 깨지지 않게 만료 전에 새 주소를 받아 둔다.
 */
const SIGNED_URL_REFRESH_MS = 1000 * 60 * 30;

const hasSignedImages = (room: Room) =>
  isSignedImageUrl(room.characterProfileImageUrl) ||
  Object.keys(room.assetImageUrls ?? {}).length > 0;

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
    refetchInterval: (query) =>
      query.state.data && hasSignedImages(query.state.data) ? SIGNED_URL_REFRESH_MS : false,
    enabled: Boolean(roomId),
  });

/** 채팅방 단건 조회 */
export const useRoomDetailQuery = (roomId?: string) =>
  useQuery(roomDetailQueryOptions(roomId));
