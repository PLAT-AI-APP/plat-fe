import {
  InfiniteData,
  QueryClient,
  infiniteQueryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError, SliceWith } from "@/type/api";
import type { RoomMessage } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

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

/**
 * 채팅방 메시지 커서 기반 무한스크롤 조회. 과거 방향으로 이어집니다.
 *
 * 서버는 페이지 안의 메시지를 오래된 것부터(시간순) 내려주고, 페이지끼리는 최신 → 과거 순으로 이어집니다.
 * 즉 pages[0] 이 가장 최근 페이지이고 각 페이지의 content[0] 이 그 페이지에서 가장 오래된 메시지입니다.
 */
export const roomMessagesQueryOptions = (roomId?: string, size = 20) =>
  infiniteQueryOptions<
    SliceWith<RoomMessage>,
    AppError,
    InfiniteData<SliceWith<RoomMessage>, string | undefined>,
    ReturnType<typeof roomQueryKeys.messages>,
    string | undefined
  >({
    queryKey: roomQueryKeys.messages(roomId),
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      getRoomMessages({
        roomId: roomId ?? "",
        beforeMessageId: pageParam,
        size,
      }),
    // 커서는 지금 페이지에서 가장 과거인 메시지 id, 즉 시간순으로 내려오는 페이지의 첫 항목입니다.
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.content[0]?.messageId : undefined,
    staleTime: 1000 * 30,
    enabled: Boolean(roomId),
  });

export const useRoomMessagesInfiniteQuery = (roomId?: string, size = 20) =>
  useInfiniteQuery(roomMessagesQueryOptions(roomId, size));

/**
 * 방금 끝난 턴의 새 메시지를 캐시 맨 앞 페이지에 붙입니다.
 *
 * 무한스크롤 쿼리를 통째로 invalidate하면 이미 불러온 페이지를 예전 커서로 다시 받아, 새 메시지만큼
 * 밀린 항목이 어느 페이지에도 없게 됩니다. 그래서 가장 최근 한 페이지만 받아 아직 없는 것만 앞에 붙입니다.
 * 새로 붙은 메시지 수를 돌려주며, 0이면 서버가 아직 저장을 마치지 않은 것입니다.
 */
export const prependLatestRoomMessages = async (
  queryClient: QueryClient,
  roomId: string,
) => {
  const latest = await getRoomMessages({ roomId });
  let addedCount = 0;

  queryClient.setQueryData<
    InfiniteData<SliceWith<RoomMessage>, string | undefined>
  >(roomQueryKeys.messages(roomId), (previous) => {
    if (!previous) return previous;

    const knownIds = new Set(
      previous.pages.flatMap((page) =>
        page.content.map((message) => message.messageId),
      ),
    );
    const fresh = latest.content.filter(
      (message) => !knownIds.has(message.messageId),
    );
    addedCount = fresh.length;
    if (fresh.length === 0) return previous;

    // 페이지 안이 시간순이라 새 메시지는 맨 뒤에 붙는다.
    const [firstPage, ...restPages] = previous.pages;
    return {
      ...previous,
      pages: [
        { ...firstPage, content: [...firstPage.content, ...fresh] },
        ...restPages,
      ],
    };
  });

  return addedCount;
};
