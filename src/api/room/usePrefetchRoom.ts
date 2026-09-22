"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { roomDetailQueryOptions } from "./getRoomDetail";
import { roomMessagesQueryOptions } from "./getRoomMessages";

/**
 * 채팅 목록 항목에 포인터를 올리거나 포커스했을 때 방 상세와 최근 메시지 한 쪽을 미리 받는다.
 * 누르는 순간 채팅방이 스켈레톤 없이 바로 이력을 그린다. 신선한 캐시가 있으면 다시 받지 않는다.
 */
export const usePrefetchRoom = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (roomId: string) => {
      void queryClient.prefetchQuery(roomDetailQueryOptions(roomId));
      void queryClient.prefetchInfiniteQuery(roomMessagesQueryOptions(roomId));
    },
    [queryClient],
  );
};
