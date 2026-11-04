import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { getNextPageNumber } from "@/lib/pagination";
import { AppError, SliceWith } from "@/type/api";
import type { ChatMemoryEntry } from "@/type/chat";
import { roomQueryKeys } from "./queryKeys";

/** 한 번에 받는 항목 수. 서버 기본값(10)과 같다. */
export const ROOM_MEMORY_PAGE_SIZE = 10;

const getRoomMemory = async (roomId: string, page: number) => {
  const response = await authAxios.get<SliceWith<ChatMemoryEntry>>(
    `/rooms/${roomId}/memory`,
    { params: { page, size: ROOM_MEMORY_PAGE_SIZE } },
  );

  return response.data;
};

/**
 * 채팅방 지나온 대화(자동 요약) 목록. 최신 턴부터 내려온다.
 *
 * 턴이 끝날 때마다 서버가 요약을 쌓고 과거 항목을 고치면 뒤 항목이 다시 만들어지므로,
 * 화면을 열 때마다 새로 받도록 오래된 것으로 두고(staleTime 0) 따로 조회한다.
 */
export const useRoomMemoryInfiniteQuery = (roomId?: string) =>
  useInfiniteQuery<SliceWith<ChatMemoryEntry>, AppError>({
    queryKey: roomQueryKeys.memory(roomId),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getRoomMemory(roomId ?? "", pageParam as number),
    getNextPageParam: getNextPageNumber,
    staleTime: 0,
    enabled: Boolean(roomId),
  });
