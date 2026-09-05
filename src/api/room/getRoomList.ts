import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError, PageWith } from "@/type/api";
import type { ThumbnailRoom } from "@/type/room";
import { useAuthStore } from "@/store/useAuthStore";

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
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useInfiniteQuery<PageWith<ThumbnailRoom>, AppError>({
    queryKey: [...ROOM_LIST_QUERY_KEY, size],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getRoomList({ page: pageParam as number, size }),
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60,
    enabled: isAuthReady && isLoggedIn,
  });
};
