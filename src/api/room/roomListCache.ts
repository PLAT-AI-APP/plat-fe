import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import type { PageWith } from "@/type/api";
import type { ThumbnailRoom } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

/**
 * 내 채팅방 목록을 서버 응답 전에 먼저 고치기 위한 도우미.
 * 목록 키는 페이지 크기별로 갈리므로(queryKeys.ts) 접두사(lists)로 한꺼번에 찾는다.
 */

type RoomPages = InfiniteData<PageWith<ThumbnailRoom>>;

export type RoomListSnapshot = [QueryKey, unknown][];

export const snapshotRoomLists = async (
  queryClient: QueryClient,
): Promise<RoomListSnapshot> => {
  const queryKey = roomQueryKeys.lists();
  await queryClient.cancelQueries({ queryKey });
  return queryClient.getQueriesData({ queryKey });
};

export const restoreRoomLists = (
  queryClient: QueryClient,
  snapshot: RoomListSnapshot | undefined,
) => {
  snapshot?.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};

export const updateRoomLists = (
  queryClient: QueryClient,
  update: (rooms: ThumbnailRoom[], pageIndex: number) => ThumbnailRoom[],
) => {
  queryClient.setQueriesData<RoomPages>(
    { queryKey: roomQueryKeys.lists() },
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page, index) => ({
          ...page,
          content: update(page.content, index),
        })),
      },
  );
};
