import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError, PageWith } from "@/type/api";
import type { ThumbnailRoom } from "@/type/room";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";

export const ROOM_LIST_QUERY_KEY = ["get-room-list"];

interface GetRoomListParams {
  page?: number;
  size?: number;
}

const getRoomList = async ({ page = 0, size = 10 }: GetRoomListParams) => {
  const response = await authAxios.get<PageWith<ThumbnailRoom>>("/rooms", {
    params: { page, size },
  });

  return response.data;
};

/** 내가 참여 중인 채팅방 목록 조회 */
export const useRoomListInfiniteQuery = (size = 10) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<PageWith<ThumbnailRoom>, AppError>({
    queryKey: [...ROOM_LIST_QUERY_KEY, size],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getRoomList({ page: pageParam as number, size }),
    getNextPageParam: getNextPageNumber,
    staleTime: 1000 * 60,
    enabled: authReady,
  });
};
