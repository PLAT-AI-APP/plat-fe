import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError, SliceWith } from "@/type/api";
import type { RoomMessage } from "@/type/room";

export const roomMessagesQueryKey = (roomId?: string) => [
  "get-room-messages",
  roomId,
];

interface GetRoomMessagesParams {
  roomId: string;
  /** 이 메시지보다 과거인 메시지를 가져옵니다. 첫 페이지는 비워 둡니다. */
  beforeMessageId?: string;
  size?: number;
}

const getRoomMessages = async ({
  roomId,
  beforeMessageId,
  size = 20,
}: GetRoomMessagesParams) => {
  const response = await authAxios.get<SliceWith<RoomMessage>>(
    `/rooms/${roomId}/messages`,
    {
      params: {
        ...(beforeMessageId && { beforeMessageId }),
        size,
      },
    },
  );

  return response.data;
};

/** 채팅방 메시지 커서 기반 무한스크롤 조회. 과거 방향으로 이어집니다. */
export const useRoomMessagesInfiniteQuery = (roomId?: string, size = 20) => {
  return useInfiniteQuery<
    SliceWith<RoomMessage>,
    AppError,
    { pages: SliceWith<RoomMessage>[]; pageParams: unknown[] },
    ReturnType<typeof roomMessagesQueryKey>,
    string | undefined
  >({
    queryKey: roomMessagesQueryKey(roomId),
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      getRoomMessages({
        roomId: roomId ?? "",
        beforeMessageId: pageParam,
        size,
      }),
    // 커서는 지금 페이지에서 가장 과거인 메시지 id입니다.
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext
        ? lastPage.content.at(-1)?.messageId
        : undefined,
    staleTime: 1000 * 30,
    enabled: Boolean(roomId),
  });
};
